# Deployment Guide

## Recommended: Vercel

Vercel is the recommended platform — it has native Next.js support with zero config.

### Step-by-Step

**1. Prepare your MongoDB database**

Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free M0 tier works):

1. Create a new cluster
2. Create a database user
3. Whitelist `0.0.0.0/0` (all IPs) or specific Vercel IPs
4. Get the connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio`

**2. Generate your admin password hash**

```bash
node -e "const b=require('bcryptjs'); b.hash('YourStrongPassword', 10).then(h=>console.log(h))"
```

**3. Generate a secure AUTH_SECRET**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**4. Validate your environment**

```bash
npm run check-env
```

**5. Push to GitHub**

Ensure `.env` is in `.gitignore` (it is — confirmed).

**6. Import to Vercel**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add all environment variables (from `.env.example` as a reference)
4. Click **Deploy**

**7. Seed the production database**

```bash
# Point to your production MongoDB
MONGODB_URI="mongodb+srv://..." npm run seed
```

**8. Verify the deployment**

- Visit your Vercel URL
- Go to `/admin/login` and sign in
- Check that all sections display correctly

---

## Alternative: Railway

Railway supports Node.js apps and provides a MongoDB add-on.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Set environment variables in the Railway dashboard.

---

## Alternative: Self-hosted (Docker)

Add `output: "standalone"` to `next.config.ts`, then:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Environment Variables Reference

```bash
# .env (copy from .env.example)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
AUTH_SECRET=<64-char-hex-string>
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD_HASH=<bcrypt-hash>
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=your-gemini-key      # optional
RESEND_API_KEY=your-resend-key      # optional
```

---

## Pre-Deployment Checklist

- [ ] `npm run check-env` passes
- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run test` passes (all tests green)
- [ ] `npm audit` shows 0 critical/high vulnerabilities
- [ ] All secrets rotated (no reuse from development)
- [ ] MongoDB Atlas IP allowlist configured
- [ ] Custom domain + SSL configured
- [ ] Database seeded (`npm run seed`)

---

## Post-Deployment

1. Visit `/admin/login` and verify login works
2. Check all portfolio sections render correctly
3. Test image upload from admin panel
4. Verify PWA install prompt appears on mobile
5. Check sitemap: `yourdomain.com/sitemap.xml`
6. Check robots.txt: `yourdomain.com/robots.txt`
