import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, updateSession } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  // Protect /admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const session = await decrypt(sessionCookie);
      if (!session || !session.email) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Update session expiry if valid
    return (await updateSession(request)) || NextResponse.next();
  }

  // If already logged in and visiting login page, redirect to dashboard
  if (pathname === "/admin/login" && sessionCookie) {
    try {
      const session = await decrypt(sessionCookie);
      if (session && session.email) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {}
  }

  // Redirect /login to /admin/login for convenience
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Protect API routes for non-GET requests
  const isProtectedApiRoute =
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/skills") ||
    pathname.startsWith("/api/experience") ||
    pathname.startsWith("/api/education") ||
    pathname.startsWith("/api/hackathon") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/upload");

  if (isProtectedApiRoute && request.method !== "GET") {
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const session = await decrypt(sessionCookie);
      if (!session || !session.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/api/projects/:path*",
    "/api/skills/:path*",
    "/api/experience/:path*",
    "/api/education/:path*",
    "/api/hackathon/:path*",
    "/api/settings/:path*",
    "/api/upload/:path*",
  ],
};
