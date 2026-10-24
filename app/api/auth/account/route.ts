/**
 * DELETE /api/auth/account
 * Deletes the authenticated admin account and logs out.
 *
 * Protected: requires a valid session cookie.
 * This is a destructive, irreversible operation.
 */

import { getSession, logout } from "@/lib/auth";
import { AdminUser } from "@/models/AdminUser";
import connectToDatabase from "@/lib/db";
import {
  apiSuccess,
  apiUnauthorized,
  apiInternalError,
} from "@/lib/api-response";

export async function DELETE(): Promise<Response> {
  try {
    const session = await getSession();
    if (!session?.email) {
      return apiUnauthorized();
    }

    await connectToDatabase();
    await AdminUser.deleteOne({ email: session.email });
    await logout();

    return apiSuccess({ success: true });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete admin account:`, error);
    return apiInternalError(errorId, "Failed to delete account.");
  }
}
