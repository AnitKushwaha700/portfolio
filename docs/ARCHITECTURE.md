# Architecture

## Overview

This is a **full-stack Next.js 16 application** using the App Router. It serves two audiences:

1. **Public visitors** — The portfolio website at `/`
2. **Admin (you)** — The CMS panel at `/admin`

```
Browser
  │
  ├── GET /          → Portfolio (Server Components, SSR)
  ├── GET /admin/*   → Admin CMS (Client Components, authenticated)
  └── /api/*         → REST API (Route Handlers, Edge-compatible)
        │
        ├── MongoDB (via Mongoose)
        └── Cloudinary (image/file storage)
```

---

## Directory Structure

```
app/
├── (main)/               # Route group: public portfolio
│   ├── page.tsx          # Server Component — fetches ALL data server-side
│   └── layout.tsx        # Floating nav + footer wrapper
│
├── admin/                # Protected CMS
│   ├── (dashboard)/      # Route group: admin pages
│   │   ├── page.tsx      # Dashboard overview
│   │   ├── projects/     # Project management
│   │   ├── skills/       # Skills management
│   │   ├── experience/   # Experience management
│   │   ├── education/    # Education management
│   │   ├── hackathon/    # Hackathon management
│   │   ├── hero/         # Hero section settings
│   │   ├── about/        # About section settings
│   │   ├── social/       # Social links settings
│   │   └── settings/     # General settings
│   └── login/            # Login page (public)
│
└── api/                  # REST API route handlers
    ├── auth/login/       # POST — authenticate admin
    ├── auth/logout/      # POST — destroy session
    ├── auth/account/     # DELETE — delete admin account
    ├── projects/         # GET (list), POST (create)
    ├── projects/[id]/    # GET, PUT, DELETE by ID/slug
    ├── skills/           # GET, POST
    ├── skills/[id]/      # PUT, DELETE
    ├── experience/       # GET, POST
    ├── experience/[id]/  # PUT, DELETE
    ├── education/        # GET, POST
    ├── education/[id]/   # PUT, DELETE
    ├── hackathon/        # GET, POST
    ├── hackathon/[id]/   # PUT, DELETE
    ├── hackathon/slug/[slug]/  # GET by slug
    ├── settings/         # GET, PUT (singleton)
    └── upload/           # POST (multipart/form-data)
```

---

## Data Flow

### Public Portfolio (SSR)

```
Request → app/(main)/page.tsx (Server Component)
           │
           ├── connectToDatabase()
           ├── PortfolioSettings.findOne()  → section visibility + content
           ├── Project.find({ visible: true })
           ├── Experience.find({ visible: true })
           ├── Skill.find({ visible: true })
           ├── Education.find({ visible: true })
           └── Hackathon.find({ visible: true })
                │
                └── Render components with data as props
```

All data is fetched server-side — no client-side API calls on the public portfolio. This means:

- Instant page load (no waterfall)
- SEO-friendly (full HTML rendered)
- No API keys or secrets exposed to the browser

### Admin CMS (Client-side fetch)

```
Admin page → useEffect / form submit
               │
               └── fetch('/api/...', { method: 'POST/PUT/DELETE' })
                     │
                     ├── middleware.ts checks session cookie
                     └── Route handler → MongoDB → JSON response
```

---

## Authentication Flow

```
Login Form
  │
  └── POST /api/auth/login
        ├── Rate limit check (5 req/min/IP)
        ├── Validate email + password
        ├── AdminUser.findOne({ email }) → bcrypt.compare()
        ├── Fallback: ADMIN_PASSWORD_HASH env var
        └── login() → set httpOnly cookie "session" (JWT, 24h)
              │
              └── middleware.ts validates cookie on every /admin/* request
```

---

## Key Design Decisions

| Decision                             | Rationale                                              |
| ------------------------------------ | ------------------------------------------------------ |
| Server Components for portfolio page | Single DB round-trip, no client waterfall, perfect SEO |
| JWT in httpOnly cookie               | XSS-resistant, no localStorage                         |
| `jose` instead of `jsonwebtoken`     | Edge Runtime compatible                                |
| Mongoose lean() on reads             | 2-3x faster, returns plain objects                     |
| Constants file                       | Prevents magic strings, enables refactoring            |
| Shared types                         | Type safety across API ↔ component boundary            |
| api-response helpers                 | Consistent JSON shapes, easy to test                   |
| Middleware on project root           | Only valid location for Next.js middleware             |

---

## Security Boundaries

```
Public   │ Admin
─────────┼──────────────────────────────────
GET /api │ POST/PUT/DELETE /api  ← requires session
GET /    │ /admin/*              ← requires session
         │ /admin/login          ← public (redirects if logged in)
```
