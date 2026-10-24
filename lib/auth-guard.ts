/**
 * Defense-in-depth authentication guard for Route Handlers.
 * Ensures API route handlers independently verify the admin session,
 * regardless of whether edge middleware/proxy executed.
 */

import { getSession } from "@/lib/auth";
import { apiUnauthorized } from "@/lib/api-response";
import type { SessionPayload } from "@/types";

export type AuthGuardResult =
  | { authorized: true; session: SessionPayload }
  | { authorized: false; response: Response };

/**
 * Checks for a valid authenticated admin session.
 * Returns either `{ authorized: true, session }` or `{ authorized: false, response }`.
 *
 * @example
 * const auth = await requireAdminSession();
 * if (!auth.authorized) return auth.response;
 */
export async function requireAdminSession(): Promise<AuthGuardResult> {
  const session = await getSession();

  if (!session?.email) {
    return {
      authorized: false,
      response: apiUnauthorized("Authentication required. Please log in."),
    };
  }

  return {
    authorized: true,
    session,
  };
}
