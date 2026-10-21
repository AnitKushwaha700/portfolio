/**
 * JWT-based session authentication helpers for Server Components and Route Handlers.
 */

import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_DURATION_MS } from "@/constants";
import type { SessionPayload } from "@/types";
import { encrypt, decrypt, updateSession } from "./session";

export { encrypt, decrypt, updateSession };

// ─── Session Management (Server Components / Route Handlers) ───────────────────

/**
 * Creates a new session cookie after successful login.
 */
export async function login(email: string): Promise<void> {
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const sessionPayload: SessionPayload = { email, expires };
  const token = await encrypt(sessionPayload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Destroys the session cookie on logout.
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Reads and decrypts the current session from the request cookies.
 * Returns null if no session or if the token is invalid/expired.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await decrypt(token);
  } catch {
    return null;
  }
}
