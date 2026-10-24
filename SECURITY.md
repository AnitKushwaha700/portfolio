# Security Policy

## Supported Versions

| Version              | Supported |
| -------------------- | --------- |
| Latest (main branch) | ✅        |
| Older commits        | ❌        |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability in this project, please report it responsibly:

**Email:** kushwahaanitak@gmail.com  
**Subject:** `[SECURITY] <brief description>`

### What to Include

Please provide as much of the following information as possible to help understand and reproduce the issue:

- Type of vulnerability (e.g., XSS, CSRF, authentication bypass, data exposure)
- Affected file(s) and line number(s)
- Step-by-step reproduction instructions
- Proof-of-concept code (if available)
- Potential impact assessment

### Response Timeline

| Stage                   | Target Time                         |
| ----------------------- | ----------------------------------- |
| Initial acknowledgement | Within 48 hours                     |
| Status update           | Within 7 days                       |
| Resolution              | Within 30 days (severity-dependent) |

---

## Security Measures in Place

### Authentication

- JWT-based session management using `jose` (Edge Runtime compatible)
- Passwords hashed with `bcryptjs` (cost factor 10)
- Sessions stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies
- 24-hour session expiry with rolling refresh

### Rate Limiting

- Login endpoint rate-limited to **5 attempts per IP per minute**
- Attempts tracked with timestamps; window automatically cleans up

### HTTP Security Headers

| Header                      | Value                                    |
| --------------------------- | ---------------------------------------- |
| `X-Content-Type-Options`    | `nosniff`                                |
| `X-Frame-Options`           | `DENY`                                   |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`    |
| `Content-Security-Policy`   | Restrictive — see `next.config.ts`       |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`        |
| `Permissions-Policy`        | Camera, microphone, geolocation disabled |
| `X-Powered-By`              | Removed (no server fingerprinting)       |

### Input Validation

- All API write endpoints validate and type-check request bodies
- String fields are trimmed before storage
- ObjectId parameters validated before MongoDB queries (prevents cast errors)
- Enum fields (e.g., skill categories) validated against allowed values

### Data Privacy

- Phone numbers masked in public API responses (`/api/settings` GET)
- Full PII only accessible to authenticated admin sessions
- No personal data logged in production

### Dependency Security

- Run `npm audit` regularly
- Dependencies kept up to date

---

## Known Limitations

1. **In-memory rate limiting**: The login rate limiter resets on server restart. For multi-replica deployments, use Redis-backed rate limiting.
2. **No CAPTCHA**: The login form does not include CAPTCHA. Acceptable for low-traffic personal portfolios.
3. **Single admin**: Designed for a single administrator account.

---

## Security Best Practices for Deployment

1. **Rotate all secrets** before production deployment
2. **Use MongoDB Atlas** with IP allowlist for production
3. **Set `NODE_ENV=production`** — enables secure cookies
4. **Use HTTPS** — HSTS is enabled but requires HTTPS at the infrastructure level
5. **Run `npm run check-env`** before every deployment
6. **Run `npm audit`** regularly and address high/critical vulnerabilities

> ⚠️ **IMPORTANT**: If any secrets were previously hardcoded in Git history, rotate them **immediately**. Git history persists even after deletion from working tree.
