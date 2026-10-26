# Attacker's Perspective Security Review & Threat Assessment

Based on: **ECC Security Review** (`github.com/affaan-m/ECC/tree/main/.agents/skills/security-review`)  
Target: **Digital Portfolio & Admin Dashboard** (`AnitKushwaha-Portfolio`)  
Audit Date: October 25, 2026  
Status: **All Identified Vulnerabilities Patched & Verified**

---

## Executive Summary

A comprehensive threat actor simulation and source code vulnerability audit was conducted across all API routes, authentication mechanisms, middleware layers, and client-facing components.

Four vulnerabilities were uncovered and remediated with immediate code-level patches:

1. **Critical Authentication Bypass & Dev Shortcut in Login Flow** ([app/api/auth/login/route.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/api/auth/login/route.ts)): The login endpoint previously defaulted to the single existing admin if an arbitrary email was submitted, eliminating email knowledge as an authentication factor and exposing the system to single-factor password spraying and timing-based user enumeration.
2. **Denial of Service via File Upload Storage Flooding** ([app/api/upload/route.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/api/upload/route.ts)): File uploads lacked per-IP rate limiting, allowing rapid local disk and Cloudinary quota exhaustion.
3. **Cross-Site Request Forgery / Account Destruction Gap in Middleware** ([proxy.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/proxy.ts)): Proxy route matcher omitted `/api/auth/:path*`, allowing cross-origin requests to reach `/api/auth/account` without global origin validation.
4. **Stored Cross-Site Scripting (DOM XSS) via `javascript:` URIs**: Multiple components dynamically rendered user/admin-supplied URLs directly in `href` attributes without protocol validation.

All 43 unit tests pass cleanly, TypeScript type-check succeeds with 0 errors, and ESLint passes with 0 warnings.

---

## Detailed Attack Path Findings & Remediations

### 1. Data Access via ID Manipulation (IDOR / Ownership Verification)

- **Attacker Analysis:**
  - An attacker modifies IDs in routes such as `GET/PUT/DELETE /api/projects/[id]`, `/api/experience/[id]`, `/api/skills/[id]`, `/api/education/[id]`, and `/api/hackathon/[id]`.
  - In multi-tenant platforms, attackers substitute their own resource IDs with those of victims (Insecure Direct Object Reference) to read or overwrite another user's documents.
- **Codebase Evaluation:**
  - This application is a single-tenant owner portfolio. No multi-tenant data or user-to-user partitions exist.
  - Public readers can only query publicly visible documents (`visible: true`). Hidden or draft records are filtered out at the MongoDB query level (`Project.findOne({ ...query, visible: true })`) unless the requester holds a verified admin session.
  - Every mutation endpoint (`POST`, `PUT`, `DELETE`) verifies the admin identity server-side via both Next.js edge proxy middleware (`proxy.ts`) and handler-level `requireAdminSession()` ([lib/auth-guard.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/lib/auth-guard.ts)).
  - All resource IDs are validated via `mongoose.Types.ObjectId.isValid(id)` before reaching the query planner, completely eliminating BSON cast crashes.
- **Outcome:** **SECURE / IMMUNE BY ARCHITECTURE**.

---

### 2. Login Bypass & Authentication Weaknesses

#### Vulnerability Found: Single Admin Fallback & Dev Email Matching

- **Attacker Exploit Mechanism:**
  - In [app/api/auth/login/route.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/api/auth/login/route.ts), fallback logic previously stated:
    ```typescript
    if (!user) {
      const adminCount = await AdminUser.countDocuments();
      if (adminCount === 1) user = await AdminUser.findOne();
    }
    ```
  - An attacker could supply an arbitrary email address (`hacker@evil.com`). Because only 1 admin account exists, the server attached the true admin account to `user` and attempted bcrypt comparison with the attacker's password.
  - Additionally, `normalizedEmail.includes("admin")` allowed any email with the word "admin" to test against `ADMIN_PASSWORD_HASH`.
  - Finally, failed email lookups returned immediately (~5ms) whereas valid users ran `bcrypt.compare` (~100ms), leaking whether an account existed via timing discrepancy.
- **Potential Damage:**
  - Complete authentication bypass and account takeover: Attacker never needed to know or guess the administrator's email address.
  - Easy brute-forcing of passwords via dictionary attacks.
- **Remediation Implemented:**
  - Removed `adminCount === 1` fallback completely.
  - Removed `.includes("admin")` fallback; strictly enforced `normalizedEmail === envEmail`.
  - Added timing attack mitigation: when no user matches, `bcrypt.compare` runs against a pre-computed constant dummy hash to equalize latency across all login attempts.

---

### 3. Privilege Escalation & Role Enforcement

- **Attacker Analysis:**
  - An attacker creates or alters a JWT token or session cookie to assert an elevated role (`"role": "admin"`), or calls admin endpoints assuming authorization checks are merely client-side.
- **Codebase Evaluation:**
  - **Server-Side Enforcement:** Neither the client bundle nor the client UI controls authorization. All mutations and dashboard pages check the encrypted session cookie on the server.
  - **Cryptographic Integrity:** Sessions are signed and encrypted using `jose` with `HS256` and the server-only `AUTH_SECRET` ([lib/session.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/lib/session.ts)). The verification algorithm is explicitly locked to `HS256`, preventing `alg: none` or RSA/HMAC confusion attacks.
  - **Defense-in-Depth:** In addition to `proxy.ts` middleware interception, every admin route handler executes `await requireAdminSession()` before parsing the request body or querying the database.
- **Outcome:** **SECURE**.

---

### 4. Feature Abuse & Denial of Service

#### Vulnerability Found: Unthrottled File Uploads

- **Attacker Exploit Mechanism:**
  - An attacker with access to `/api/upload` (or through a compromised session) could post large files repeatedly in an automated loop.
- **Potential Damage:**
  - Local disk exhaustion (`public/uploads`) or Cloudinary monthly bandwidth/storage quota exhaustion, resulting in site-wide media delivery failure and potential hosting suspension.
- **Remediation Implemented:**
  - Added in-memory sliding-window rate limiting to [app/api/upload/route.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/api/upload/route.ts) restricting requests to **10 uploads per IP per 60 seconds**.
  - Login route already enforces **5 attempts per minute per IP** with `429 Too Many Requests` and standard `Retry-After` headers.
  - Mass account registration abuse is impossible as no signup/registration endpoints exist.
  - Contact messaging spam is impossible as contact links utilize client-side `mailto:` and direct phone protocols rather than unthrottled server messaging queues.

---

### 5. Content Injection & Cross-Site Scripting (XSS / NoSQL Injection)

#### Vulnerability Found: DOM XSS via Unsanitized Dynamic `href` Attributes

- **Attacker Exploit Mechanism:**
  - An attacker saves a project, hackathon, social link, or certificate containing a payload like `javascript:/* malicious payload */` or `data:text/html,...`.
  - When regular users or administrators click "View Certificate", "Live Demo", "GitHub Profile", or "Open External Resume", the browser executes the script in the context of the user's session.
- **Potential Damage:**
  - Client-side token/cookie exfiltration, DOM manipulation, credential phishing, or redirecting visitors to malicious domains.
- **Remediation Implemented:**
  - Integrated `sanitizeUrl()` ([utils/index.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/utils/index.ts)) to strictly whitelist `http:`, `https:`, `mailto:`, and `tel:` protocols, while returning `#` for any `javascript:`, `data:`, or `vbscript:` schemes.
  - Sanitization applied to all dynamic link targets:
    - [components/portfolio/Hero.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/Hero.tsx)
    - [components/portfolio/Hackathons.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/Hackathons.tsx)
    - [components/portfolio/Education.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/Education.tsx)
    - [components/portfolio/Projects.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/Projects.tsx)
    - [components/portfolio/TopBar.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/TopBar.tsx)
    - [app/projects/[slug]/page.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/projects/[slug]/page.tsx)
    - [app/(main)/hackathons/[slug]/page.tsx](<file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/(main)/hackathons/[slug]/page.tsx>)
    - [app/admin/(dashboard)/resume/page.tsx](<file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/admin/(dashboard)/resume/page.tsx>)

#### NoSQL / SQL Injection Assessment:

- All MongoDB queries use parameterized Mongoose methods (`findOne({ email: normalizedEmail })`) where fields are explicitly typed strings.
- All request bodies are strictly type-validated (`typeof email !== "string"`), preventing MongoDB query operator injection objects (e.g. `{ email: { $gt: "" } }`).
- Text rendering is performed exclusively via React JSX curly brace expressions, preventing HTML tag injection.

---

### 6. Internal Exposure & Sensitive Information Leakage

#### Vulnerability Found: Incomplete Proxy Route Matcher & Sensitive File Access

- **Attacker Exploit Mechanism:**
  - Next.js proxy matcher previously omitted `/api/auth/:path*`.
  - Direct probing of dotfiles (`/.env`, `/.git`) could potentially expose configurations if misconfigured by edge proxies.
- **Potential Damage:**
  - CSRF origin validation was bypassed on `/api/auth/account`.
  - System or environment reconnaissance.
- **Remediation Implemented:**
  - Updated `config.matcher` in [proxy.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/proxy.ts) to `["/admin/:path*", "/login", "/api/:path*"]`, guaranteeing universal proxy middleware execution for all API routes.
  - Added explicit blocking of sensitive paths (`/.env*`, `/.git*`, and path traversal `../`) returning immediate 404 responses.
  - Added `/api/auth/account` to `PROTECTED_API_PREFIXES`.
  - Checked error handling across all routes: `apiInternalError(errorId)` replaces raw database errors or stack traces with opaque UUID identifiers.
  - Verified `poweredByHeader: false` in [next.config.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/next.config.ts) to suppress the `X-Powered-By: Next.js` fingerprint header.
  - Verified static file serving: only assets in `public/` are accessible; internal files, configs, and documentation remain inaccessible.

---

### 7. Business Logic & Monetary Manipulation

- **Attacker Analysis:**
  - Manipulating payment totals, applying negative balances, stacking promo codes, restarting trial periods, or self-referrals.
- **Codebase Evaluation:**
  - The application is a software engineering digital portfolio. It contains no payment processors, carts, billing logic, discounts, or referral mechanisms.
  - The attack surface for monetary and referral manipulation is **zero**.
- **Outcome:** **NOT APPLICABLE / ZERO ATTACK SURFACE**.

---

## Verification & Automated Test Status

| Verification Step        | Command                               | Result                           |
| :----------------------- | :------------------------------------ | :------------------------------- |
| **Unit Test Suite**      | `npm test`                            | **43 / 43 tests passing** (100%) |
| **TypeScript Typecheck** | `npm run type-check` (`tsc --noEmit`) | **0 errors**                     |
| **ESLint Validation**    | `npm run lint`                        | **0 errors, 0 warnings**         |

---

## Summary Matrix of Exploits & Remediations

| Attack Vector            | Attacker Action                                                  | Severity     | Status       | Fixed In                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------------- | :--------------------------------------------------------------- | :----------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login Bypass**         | Submit arbitrary email to trigger single-admin fallback          | **Critical** | **RESOLVED** | [app/api/auth/login/route.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/api/auth/login/route.ts)                                                                                                                                                                                                                                                                                                                 |
| **User Enumeration**     | Measure response latency differences on login endpoint           | **Medium**   | **RESOLVED** | [app/api/auth/login/route.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/api/auth/login/route.ts)                                                                                                                                                                                                                                                                                                                 |
| **Storage DoS**          | Flood file upload endpoint with 5MB payloads                     | **High**     | **RESOLVED** | [app/api/upload/route.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/api/upload/route.ts)                                                                                                                                                                                                                                                                                                                         |
| **Middleware Bypass**    | Target `/api/auth/account` without global CSRF validation        | **High**     | **RESOLVED** | [proxy.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/proxy.ts)                                                                                                                                                                                                                                                                                                                                                       |
| **Stored DOM XSS**       | Supply `javascript:` URI in project, social, or certificate URLs | **High**     | **RESOLVED** | [Hero.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/Hero.tsx), [Hackathons.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/Hackathons.tsx), [Education.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/components/portfolio/Education.tsx), [page.tsx](file:///c:/Users/kushw/Github-Projects/digital-portfolio/app/projects/[slug]/page.tsx) |
| **Direct File Probing**  | Request direct dotfiles (`/.env`, `/.git`)                       | **Low**      | **RESOLVED** | [proxy.ts](file:///c:/Users/kushw/Github-Projects/digital-portfolio/proxy.ts)                                                                                                                                                                                                                                                                                                                                                       |
| **NoSQL Injection**      | Inject query operator objects (`{ $gt: "" }`)                    | **Critical** | **IMMUNE**   | Input type guards & Mongoose casting                                                                                                                                                                                                                                                                                                                                                                                                |
| **Payment Manipulation** | Exploit payment gateways, coupons, or free trials                | **N/A**      | **IMMUNE**   | No financial or billing logic exists                                                                                                                                                                                                                                                                                                                                                                                                |
