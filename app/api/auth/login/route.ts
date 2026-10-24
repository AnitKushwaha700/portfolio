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

export const dynamic = "force-dynamic";

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

    const user = await AdminUser.findOne({ email: normalizedEmail });

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

    // ── Env-Var Fallback (Strict exact match only) ──────────────────────────
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (envHash && envEmail && normalizedEmail === envEmail) {
      const isMatch = await bcrypt.compare(normalizedPassword, envHash);
      if (isMatch) {
        console.log("[AUTH] Login success via env hash: [REDACTED]");
        await login(envEmail);
        return apiSuccess({ success: true });
      }
    }

    // ── Timing Attack Mitigation ───────────────────────────────────────────
    // If no user matched, perform a dummy comparison to equalize execution time
    // and prevent user enumeration via response latency analysis.
    if (!user && (!envHash || !envEmail || normalizedEmail !== envEmail)) {
      const DUMMY_HASH =
        "$2b$10$w4q7FjY6zE1eR9V8zP3A0u2F0v3l5h6j7k8l9m0n1o2p3q4r5s6t";
      await bcrypt.compare(normalizedPassword, DUMMY_HASH).catch(() => false);
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
