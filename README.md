# Anit Kushwaha — Digital Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

A **full-stack, database-driven personal portfolio** with an integrated admin CMS panel. Built to production-grade standards with security hardening, type safety, and PWA support.

---

## ✨ Features

- 🎨 **Animated 3D Landing** — Three.js + React Three Fiber interactive background
- 📊 **Admin CMS Panel** — Manage all portfolio content via a secure dashboard
- 🔐 **JWT Authentication** — Secure httpOnly cookie sessions with bcrypt password hashing
- ☁️ **Cloudinary Integration** — Cloud image/file storage with CDN delivery
- 📱 **PWA Support** — Installable, offline-capable via Serwist service worker
- 🤖 **AI Integration** — Google Gemini API for content assistance
- 🔒 **Security-First** — HSTS, CSP, X-Frame-Options, rate limiting, input validation
- 📈 **SEO Optimized** — OpenGraph, Twitter cards, sitemap, robots.txt

---

## 🏗️ Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Framework  | Next.js 16 (App Router)    |
| UI         | React 19 + Tailwind CSS v4 |
| Language   | TypeScript 5 (strict mode) |
| Animations | Framer Motion + Three.js   |
| Database   | MongoDB via Mongoose       |
| Auth       | JWT (jose) + bcryptjs      |
| Storage    | Cloudinary                 |
| Email      | Resend                     |
| AI         | Google Gemini              |
| PWA        | Serwist                    |
| Testing    | Vitest                     |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Cloudinary](https://cloudinary.com/) account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/AnitKushwaha700/digital-portfolio.git
cd digital-portfolio
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values. See the [Environment Variables](#-environment-variables) section below.

### 3. Generate a Bcrypt Hash for Your Password

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('YourPassword123', 10).then(h=>console.log(h))"
```

Set the output as `ADMIN_PASSWORD_HASH` in your `.env`.

### 4. Seed the Database

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in all values.

| Variable                | Required | Description                                                    |
| ----------------------- | -------- | -------------------------------------------------------------- |
| `MONGODB_URI`           | ✅       | MongoDB connection string                                      |
| `AUTH_SECRET`           | ✅       | JWT signing secret (min 32 chars — use `openssl rand -hex 32`) |
| `ADMIN_EMAIL`           | ✅       | Admin panel login email                                        |
| `ADMIN_PASSWORD_HASH`   | ✅       | bcrypt hash of admin password                                  |
| `CLOUDINARY_CLOUD_NAME` | ✅       | Cloudinary cloud name                                          |
| `CLOUDINARY_API_KEY`    | ✅       | Cloudinary API key                                             |
| `CLOUDINARY_API_SECRET` | ✅       | Cloudinary API secret                                          |
| `GEMINI_API_KEY`        | Optional | Google Gemini AI key                                           |
| `RESEND_API_KEY`        | Optional | Resend email service key                                       |

**Validate your configuration before deploying:**

```bash
npm run check-env
```

> [!WARNING]
> **Secret Rotation & Git History Notice**:
> If any secret, API key, password hash, or database URL was ever previously committed to Git (in any branch or fork), it remains permanently readable in Git history. Rotate all previously hardcoded or committed credentials immediately in their respective provider consoles (MongoDB Atlas, Cloudinary, Resend, etc.) before deploying to production.

---

## 📁 Project Structure

```
digital-portfolio/
├── app/                  # Next.js App Router pages & API routes
│   ├── (main)/           # Public portfolio pages
│   ├── admin/            # Protected admin CMS panel
│   └── api/              # REST API route handlers
├── components/           # React components
│   ├── portfolio/        # Portfolio section components
│   ├── admin/            # Admin dashboard components
│   ├── ui/               # Shared UI primitives
│   └── pwa/              # PWA install prompt
├── lib/                  # Core utilities
│   ├── auth.ts           # JWT session management
│   ├── db.ts             # MongoDB connection
│   ├── env.ts            # Runtime env validation
│   └── api-response.ts   # Standardized API response helpers
├── models/               # Mongoose schema definitions
├── types/                # Shared TypeScript types
├── utils/                # Utility functions (cn, slugify, etc.)
├── hooks/                # Custom React hooks
├── constants/            # App-wide constants
├── scripts/              # CLI scripts (seed, check-env)
└── __tests__/            # Vitest test suite
```

---

## 🧪 Running Tests

```bash
npm run test              # Run all tests once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed deployment guides.

---

## 🔒 Security

- Report security vulnerabilities to: **kushwahaanitak@gmail.com**
- See [`SECURITY.md`](SECURITY.md) for the full security policy

> ⚠️ **IMPORTANT**: If any secrets were previously hardcoded in the Git history, rotate them immediately before deploying to production.

---

## 📄 License

This project is for personal portfolio use. All rights reserved.
