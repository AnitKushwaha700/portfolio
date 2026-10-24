/**
 * POST /api/auth/login
 * Authenticates an admin user and creates a session cookie.
 *
 * Rate limited to 5 attempts per IP per minute.
 * Checks DB user first, then falls back to env-var hash.
 */

import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import { AdminUser } from "@/models/AdminUser";
import {
  apiBadRequest,
  apiInternalError,
  apiSuccess,
  apiTooManyRequests,
  apiUnauthorized,
} from "@/lib/api-response";
import { RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS } from "@/constants";

// In-memory rate limit store.
// Note: This resets on server restarts and does not scale across multiple
// instances. For production with multiple replicas, use Redis or DB-backed
// rate limiting. For single-instance deployments (Vercel serverless), this
// provides adequate protection.
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Clean up timestamps outside the current window
  const attempts = (rateLimitStore.get(ip) ?? []).filter(
    (t) => t >= windowStart,
  );

  if (attempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    return true;
  }

  rateLimitStore.set(ip, [...attempts, now]);
  return false;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // ── Rate Limiting ──────────────────────────────────────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return apiTooManyRequests();
    }

    // ── Input Parsing & Validation ─────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON in request body.");
    }

    if (typeof body !== "object" || body === null) {
      return apiBadRequest("Request body must be a JSON object.");
    }

    const { email, password } = body as Record<string, unknown>;

    if (typeof email !== "string" || !email.trim()) {
      return apiBadRequest("Email is required.");
    }
    if (typeof password !== "string" || !password) {
      return apiBadRequest("Password is required.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    console.log("[AUTH] Login attempt for: [REDACTED]");

    // ── DB Lookup ──────────────────────────────────────────────────────────
    const db = await import("@/lib/db");
    await db.default();

    let user = await AdminUser.findOne({ email: normalizedEmail });

    // Fallback: If only one admin account exists and email doesn't match,
    // still try the single admin (handles minor email variations in dev).
    if (!user) {
      const adminCount = await AdminUser.countDocuments();
      if (adminCount === 1) {
        user = await AdminUser.findOne();
      }
    }

    if (user) {
      const isMatch = await bcrypt.compare(
        normalizedPassword,
        user.passwordHash,
      );
      if (isMatch) {
        console.log("[AUTH] Login success for DB user: [REDACTED]");
        await login(user.email);
        return apiSuccess({ success: true });
      }
    }

    // ── Env-Var Fallback ───────────────────────────────────────────────────
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    const envEmail = process.env.ADMIN_EMAIL?.toLowerCase();

    if (
      envHash &&
      (normalizedEmail === envEmail || normalizedEmail.includes("admin"))
    ) {
      const isMatch = await bcrypt.compare(normalizedPassword, envHash);
      if (isMatch) {
        console.log("[AUTH] Login success via env hash: [REDACTED]");
        await login(process.env.ADMIN_EMAIL ?? normalizedEmail);
        return apiSuccess({ success: true });
      }
    }

    console.warn("[AUTH] Invalid credentials attempt: [REDACTED]");
    return apiUnauthorized(
      "Invalid credentials. Please check your email and password.",
    );
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Login error:`, error);
    return apiInternalError(errorId);
  }
}
