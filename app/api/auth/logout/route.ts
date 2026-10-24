/**
 * POST /api/auth/logout
 * Destroys the session cookie and redirects to the login page.
 */

import { logout } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";

export async function POST(): Promise<Response> {
  await logout();
  return apiSuccess({ success: true });
}
