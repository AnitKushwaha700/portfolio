/**
 * Standardized API response helpers.
 * Use these instead of inline NextResponse.json() calls for consistency.
 */

import { NextResponse } from "next/server";

// ─── Success Responses ────────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    return NextResponse.json({ ...data, data }, { status });
  }
  return NextResponse.json({ data }, { status });
}

export function apiCreated<T>(data: T): NextResponse {
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    return NextResponse.json({ ...data, data }, { status: 201 });
  }
  return NextResponse.json({ data }, { status: 201 });
}

// ─── Error Responses ──────────────────────────────────────────────────────────

export function apiError(
  message: string,
  status: number,
  errorId?: string,
): NextResponse<{ error: string; errorId?: string }> {
  return NextResponse.json(
    { error: message, ...(errorId && { errorId }) },
    { status },
  );
}

export function apiBadRequest(
  message = "Bad request",
): NextResponse<{ error: string }> {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function apiUnauthorized(
  message = "Unauthorized",
): NextResponse<{ error: string }> {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function apiForbidden(
  message = "Forbidden",
): NextResponse<{ error: string }> {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function apiNotFound(
  message = "Not found",
): NextResponse<{ error: string }> {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function apiTooManyRequests(
  message = "Too many requests. Please try again later.",
  retryAfterSeconds = 60,
): NextResponse<{ error: string }> {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": "0",
      },
    },
  );
}

export function apiInternalError(
  errorId: string,
  message = "Internal server error",
): NextResponse<{ error: string; errorId: string }> {
  return NextResponse.json({ error: message, errorId }, { status: 500 });
}
