/**
 * Edge-compatible JWT session helpers.
 * Kept separate from next/headers to avoid bundling Node.js APIs into Edge/Proxy runtime.
 */

import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_DURATION_MS, JWT_ALGORITHM } from "@/constants";
import type { SessionPayload } from "@/types";

function getSecretKey(): Uint8Array {
  const secretKey = process.env.AUTH_SECRET;
  if (!secretKey) {
    // During Next.js static build analysis or test runs, provide a safe fallback placeholder
    // so module evaluation does not crash the bundler before env vars are available.
    if (
      process.env.VERCEL ||
      process.env.CI ||
      process.env.npm_lifecycle_event === "build" ||
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NODE_ENV === "test" ||
      !process.env.NODE_ENV
    ) {
      return new TextEncoder().encode(
        "build_placeholder_secret_key_minimum_32_characters",
      );
    }
    throw new Error(
      "[auth] Missing AUTH_SECRET environment variable. " +
        "Please define it in your hosting provider's Environment Variables (e.g. Vercel Project Settings) or .env file.",
    );
  }
  return new TextEncoder().encode(secretKey);
}

/**
 * Signs a JWT with the session payload.
 * Token expires in 24 hours.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(getSecretKey());
}

/**
 * Verifies and decodes a JWT.
 * Throws if the token is invalid or expired.
 */
export async function decrypt(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    algorithms: [JWT_ALGORITHM],
  });
  return payload as unknown as SessionPayload;
}

/**
 * Middleware/Proxy helper: refreshes the session expiry on each authenticated request.
 * Returns a NextResponse with an updated cookie, or null if the session is invalid.
 */
export async function updateSession(
  request: NextRequest,
): Promise<NextResponse | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const parsed = await decrypt(token);
    const newExpires = new Date(Date.now() + SESSION_DURATION_MS);
    const newPayload: SessionPayload = { ...parsed, expires: newExpires };

    const response = NextResponse.next();
    response.cookies.set({
      name: COOKIE_NAME,
      value: await encrypt(newPayload),
      httpOnly: true,
      expires: newExpires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch {
    return null;
  }
}
