/**
 * Next.js Proxy — Route protection and session management.
 *
 * This file is named `proxy.ts` at the project root per Next.js 16+ convention.
 * It executes on the server before requests are completed.
 *
 * Protected routes:
 * - /admin/* (except /admin/login) — requires valid session
 * - /api/projects, /api/skills, /api/experience, /api/education,
 *   /api/hackathon, /api/settings, /api/upload — write methods require session
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, updateSession } from "./lib/session";

const PROTECTED_API_PREFIXES = [
  "/api/projects",
  "/api/skills",
  "/api/experience",
  "/api/education",
  "/api/hackathon",
  "/api/settings",
  "/api/upload",
  "/api/auth/account",
] as const;

const READ_ONLY_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Returns true if the request targets a protected API path
 * AND uses a write HTTP method (POST, PUT, PATCH, DELETE).
 */
function isProtectedApiMutation(pathname: string, method: string): boolean {
  if (READ_ONLY_METHODS.has(method)) return false;
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  // ── Block direct access attempts to sensitive internal dotfiles ────────────
  if (
    pathname.startsWith("/.env") ||
    pathname.startsWith("/.git") ||
    pathname.includes("../")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // ── Convenience redirect: /login → /admin/login ────────────────────────────
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // ── Protected admin panel (/admin/* except /admin/login) ───────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const session = await decrypt(sessionCookie);
      if (!session?.email) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Slide the session expiry forward on every authenticated page load
    return (await updateSession(request)) ?? NextResponse.next();
  }

  // ── Redirect logged-in users away from the login page ─────────────────────
  if (pathname === "/admin/login" && sessionCookie) {
    try {
      const session = await decrypt(sessionCookie);
      if (session?.email) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {
      // Session is invalid; fall through and show the login page
    }
  }

  // ── CSRF / Cross-Origin Validation for API write mutations ──────────────
  if (!READ_ONLY_METHODS.has(request.method) && pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { error: "Forbidden: Cross-origin request blocked." },
            { status: 403 },
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Forbidden: Invalid origin header." },
          { status: 403 },
        );
      }
    }
  }

  // ── Protected API write mutations ──────────────────────────────────────────
  if (isProtectedApiMutation(pathname, request.method)) {
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const session = await decrypt(sessionCookie);
      if (!session?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/api/:path*"],
};
