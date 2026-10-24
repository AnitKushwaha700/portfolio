# Changelog

All notable changes to this project are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added

- `middleware.ts` — Active Next.js middleware (renamed from dead `proxy.ts`)
- `lib/env.ts` — Runtime environment variable validation with fail-fast behaviour
- `lib/api-response.ts` — Standardized API response helper functions
- `constants/index.ts` — Application-wide constants (no more magic strings/numbers)
- `utils/index.ts` — Shared utilities: `cn()`, `slugify()`, `truncate()`, `sanitizeString()`, `getFileExtension()`, `formatDate()`
- `hooks/use-copy-to-clipboard.ts` — Reusable clipboard hook (extracted from Contact component)
- `types/index.ts` — Comprehensive shared TypeScript types for all models and component props
- `scripts/check-env.ts` — Pre-deployment environment variable validator with format checks
- `vitest.config.ts` — Vitest test configuration
- `__tests__/` — Test suite: utils, auth, constants unit tests
- `SECURITY.md` — Responsible disclosure policy and security documentation
- `docs/` — Developer documentation (Architecture, API, Deployment, Contributing)
- `poweredByHeader: false` in `next.config.ts` — Removes Next.js fingerprint
- `Referrer-Policy` and `Permissions-Policy` security headers
- Phone number masking in public `GET /api/settings` response (data privacy)
- ObjectId validation before all MongoDB queries (prevents cast errors)
- File size validation (10 MB limit) in upload API
- Local fallback disabled in production for upload API (security)

### Changed

- All API routes refactored: typed input validation, `lean()` queries, standardized responses
- `lib/auth.ts` — Replaced all `any` with `SessionPayload` type, uses named constants
- `lib/db.ts` — Properly typed global cache (no `any`), correct global variable pattern
- `components/portfolio/Contact.tsx` — Uses `useCopyToClipboard` hook, `ContactProps` type
- `package.json` — Added `type-check`, `test:watch`, `test:coverage`, `test:ci`, `check-env`, `validate` scripts
- `README.md` — Replaced default Next.js boilerplate with professional documentation
- CSP in `next.config.ts` formatted as readable array for maintainability
- Skills category enum validated at API level, not just at database level
- Hackathon slug generation uses shared `slugify()` utility

### Fixed

- **Critical**: `proxy.ts` was never executed as middleware — renamed to `middleware.ts`
- Inconsistent error responses across API routes (some had `errorId`, some didn't)
- `mongoose.connect()` return type mismatch in `lib/db.ts`
- Upload route would fall back to local storage silently in production

### Security

- Admin API mutations now properly protected by active middleware
- Input validation prevents malformed data reaching MongoDB
- PII (phone number) masked in public API responses
- File uploads limited to 10 MB with explicit MIME type handling

---

## [0.1.0] — 2026-10-20

### Added

- Initial project: Next.js 16 portfolio with MongoDB CMS
- Admin panel with JWT authentication
- Portfolio sections: Hero (3D), About, Skills, Experience, Projects, Education, Hackathons, Contact
- Cloudinary image/file upload integration
- PWA support via Serwist
- Google Gemini AI integration
- SEO: OpenGraph, Twitter cards, sitemap, robots.txt
