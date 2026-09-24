import { AdminUser } from "@/models/AdminUser";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    // Rate Limiting: 5 attempts per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const windowStart = now - 60 * 1000;

    // Clean up old entries
    for (const [key, timestamp] of rateLimitMap.entries()) {
      if (timestamp < windowStart) rateLimitMap.delete(key);
    }

    // Count attempts for this IP in the last minute
    const attemptCount = Array.from(rateLimitMap.entries()).filter(
      ([k, t]) => k.startsWith(ip + ":") && t >= windowStart,
    ).length;

    if (attemptCount >= 5) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }

    // Record this attempt
    rateLimitMap.set(`${ip}:${now}`, now);

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    console.log(`[AUTH] Login attempt for: [REDACTED]`);

    const db = await import("@/lib/db");
    await db.default();

    // 1. Find user in database
    let user = await AdminUser.findOne({ email: normalizedEmail });

    // Fallback: If only 1 admin account exists in DB, let the admin log in even if email has slight variation
    if (!user) {
      const adminCount = await AdminUser.countDocuments();
      if (adminCount === 1) {
        user = await AdminUser.findOne();
      }
    }

    if (user) {
      // Check bcrypt hash
      const isMatch = await bcrypt.compare(
        normalizedPassword,
        user.passwordHash,
      );
      if (isMatch) {
        console.log(`[AUTH] Login success for user: [REDACTED]`);
        await login(user.email);
        return NextResponse.json({ success: true });
      }
    }

    // 3. Fallback check against env vars
    if (
      process.env.ADMIN_PASSWORD_HASH &&
      (normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase() ||
        normalizedEmail.includes("admin"))
    ) {
      const isMatch = await bcrypt.compare(
        normalizedPassword,
        process.env.ADMIN_PASSWORD_HASH,
      );
      if (isMatch) {
        console.log(`[AUTH] Login success via env hash: [REDACTED]`);
        await login(process.env.ADMIN_EMAIL || normalizedEmail);
        return NextResponse.json({ success: true });
      }
    }

    console.warn(`[AUTH] Invalid credentials for: [REDACTED]`);
    return NextResponse.json(
      { error: "Invalid credentials. Please check your email and password." },
      { status: 401 },
    );
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Login error:`, error);
    return NextResponse.json(
      { error: "Internal server error", errorId },
      { status: 500 },
    );
  }
}
