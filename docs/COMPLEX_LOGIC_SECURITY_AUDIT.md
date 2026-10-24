# Deep Security Audit: Critical Paths & Complex Logic

*Based on [Trail of Bits Security Audit Standards](https://github.com/trailofbits/skills).*

---

## Scope & Target Architecture

- **Application Type:** Next.js Full-Stack Digital Portfolio & Admin Management Console.
- **Authentication:** Custom JWT-in-Cookie Session Management (`HS256`, `httpOnly`, `secure`, `sameSite: lax`) + Bcrypt (Cost 10).
- **Database:** MongoDB via Mongoose ODM.
- **File Ingestion:** Multipart Form Streaming to Local Disk Fallback & Cloudinary API.
- **Payments:** None. This application has zero ecommerce, pricing, or payment processor endpoints.

---

## Executive Vulnerability Matrix

| ID | Category | Severity | Title | Status |
| :-: | :--- | :-: | :--- | :-: |
| **TOB-01** | **Auth & Authorization** | **HIGH** | Missing In-Handler Auth Enforcement (Defense-in-Depth) | **RESOLVED** |
| **TOB-02** | **Input Handling** | **HIGH** | Unrestricted File Upload Extensions (Stored XSS Risk) | **RESOLVED** |
| **TOB-03** | **Input Handling** | **MEDIUM** | Unsanitized `href` Links (DOM/Stored `javascript:` XSS) | **RESOLVED** |
| **TOB-04** | **Input Handling** | **LOW** | Potential Mass-Assignment on Mongoose Document Updates | **RESOLVED** |
| **TOB-05** | **Auth & Authorization** | **INFO** | Stateless JWT Revocation Surface on Logout | **DOCUMENTED** |
| **TOB-06** | **Payment Logic** | **INFO** | Payment Surface Analysis (Not Applicable) | **AUDITED** |

---

## Detailed Vulnerability Assessments & Remediations

### TOB-01: Missing In-Handler Auth Enforcement (Defense-in-Depth)

- **Vulnerability:**
  Several API mutation routes (`/api/projects`, `/api/skills`, `/api/experience`, `/api/education`, `/api/hackathon`, `/api/settings`, `/api/upload`) relied exclusively on Next.js Edge proxy/middleware (`proxy.ts`) for authorization, without validating the session inside the actual route handlers.
- **Exploit Scenario:**
  If edge middleware rules are misconfigured, bypassed via path rewriting, or fail during serverless execution, an unauthenticated attacker could issue raw HTTP `POST`, `PUT`, or `DELETE` requests directly to mutation endpoints, altering or deleting portfolio content.
- **Location:**
  - `app/api/upload/route.ts`
  - `app/api/projects/route.ts` & `[id]/route.ts`
  - `app/api/skills/route.ts` & `[id]/route.ts`
  - `app/api/experience/route.ts` & `[id]/route.ts`
  - `app/api/education/route.ts` & `[id]/route.ts`
  - `app/api/hackathon/route.ts` & `[id]/route.ts`
  - `app/api/settings/route.ts`
- **Remediation Implemented:**
  Created a reusable in-handler authorization guard `requireAdminSession()` in `lib/auth-guard.ts`. Every mutation handler (`POST`, `PUT`, `DELETE`) independently validates the session cookie before parsing request bodies or touching the database:
  ```ts
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;
  ```

---

### TOB-02: Unrestricted File Upload Extensions (Stored XSS / Execution Risk)

- **Vulnerability:**
  `POST /api/upload` accepted multipart files and generated local file paths in `public/uploads/${baseName}_${Date.now()}.${extension}` based on the client-supplied filename extension, without enforcing a strict extension whitelist.
- **Exploit Scenario:**
  An authenticated attacker (or attacker exploiting an auth bypass) could upload an HTML file (`payload.html`) or an SVG containing embedded JavaScript (`<svg onload="alert(1)">`). Because files in `public/uploads/` are served by Next.js as static files, navigating to the URL would execute arbitrary JavaScript in the portfolio origin (Same-Origin Stored XSS).
- **Location:**
  - `app/api/upload/route.ts` (lines 52–68)
  - `constants/index.ts`
- **Remediation Implemented:**
  1. Defined `ALLOWED_FILE_EXTENSIONS` in `constants/index.ts`:
     - Safe Images: `jpg`, `jpeg`, `png`, `webp`, `gif`, `avif`.
     - Safe Documents: `pdf`, `doc`, `docx`.
  2. Enforced server-side validation in `app/api/upload/route.ts`:
     ```ts
     if (!extension || !ALLOWED_FILE_EXTENSIONS.has(extension)) {
       return apiBadRequest(`File extension ".${extension}" is not permitted.`);
     }
     ```
  3. Rejected executable extensions (`.html`, `.svg`, `.js`, `.sh`, `.exe`, etc.).

---

### TOB-03: Unsanitized `href` Links (DOM/Stored `javascript:` XSS)

- **Vulnerability:**
  External links for projects (`project.liveUrl`, `project.githubUrl`), social profiles (`social.github`, `social.linkedin`), and resume download buttons were rendered directly into anchor tags (`<a href={...}>` / `<Link href={...}>`) without URL protocol validation.
- **Exploit Scenario:**
  If a URL containing `javascript:alert(document.cookie)` or a malicious `data:` URI were stored in the database, clicking the link on the public homepage would trigger immediate script execution.
- **Location:**
  - `components/portfolio/Projects.tsx`
  - `components/portfolio/TopBar.tsx`
  - `components/portfolio/Contact.tsx`
- **Remediation Implemented:**
  Implemented `sanitizeUrl()` in `utils/index.ts` and added unit test coverage:
  ```ts
  export function sanitizeUrl(url: string | undefined | null): string {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed === "#" || trimmed.startsWith("/")) return trimmed;
    try {
      const parsed = new URL(trimmed);
      if (["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
        return trimmed;
      }
      return "#";
    } catch {
      return trimmed.startsWith("#") ? trimmed : "#";
    }
  }
  ```
  All anchor tags now wrap untrusted URLs with `sanitizeUrl(...)` and enforce `rel="noopener noreferrer"`.

---

### TOB-04: Potential Mass-Assignment on Mongoose Document Updates

- **Vulnerability:**
  Routes using `findByIdAndUpdate(id, body, { runValidators: true })` accepted raw JSON objects directly from the client.
- **Remediation:**
  Mongoose schemas have `strict: true` enabled by default, stripping unmapped properties. Added strict ID format validation (`mongoose.Types.ObjectId.isValid(id)`) across all `[id]` route handlers to block NoSQL operator injections.

---

### TOB-05: Stateless JWT Revocation Surface on Logout

- **Analysis:**
  Authentication uses stateless signed JWTs (`jose`, `HS256`, 24-hour expiration) stored in `httpOnly`, `secure`, `sameSite: lax` cookies.
  `POST /api/auth/logout` expires the cookie on the client.
- **Risk Assessment:**
  Because tokens are stateless without a Redis-backed revocation list, a stolen token remains cryptographically valid until its 24-hour expiration.
- **Defense-in-Depth:**
  - Token is inaccessible to client JavaScript via `httpOnly`.
  - Cookie is protected against network sniffing via `secure: true`.
  - CSRF Origin check in `proxy.ts` prevents cross-site submission of the cookie.

---

### TOB-06: Payment Logic Audit (Not Applicable)

- **Audit Result:**
  Full codebase grep for `stripe`, `razorpay`, `paypal`, `lemonsqueezy`, `amount`, and `webhook` confirmed that the application has **no payment gateways, checkout flows, or paid feature access gates**. Zero financial logic risks exist.
