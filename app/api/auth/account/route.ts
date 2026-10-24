/**
 * DELETE /api/auth/account
 * Deletes the authenticated admin account and logs out.
 *
 * Protected: requires a valid session cookie.
 * This is a destructive, irreversible operation.
 */

import { getSession, logout } from "@/lib/auth";
import { AdminUser } from "@/models/AdminUser";
import { PortfolioSettings } from "@/models/PortfolioSettings";
import connectToDatabase from "@/lib/db";
import {
  apiSuccess,
  apiUnauthorized,
  apiInternalError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function DELETE(): Promise<Response> {
  try {
    const session = await getSession();
    if (!session?.email) {
      return apiUnauthorized();
    }

    await connectToDatabase();
    await AdminUser.deleteOne({ email: session.email });

    // Honor complete data deletion: anonymize personal data in settings
    const settings = await PortfolioSettings.findOne();
    if (settings) {
      settings.social = {
        github: "",
        linkedin: "",
        email: "deleted-account@anonymized.local",
        phone: "",
      };
      settings.hero = {
        ...settings.hero,
        name: "Anonymous User",
        headline: "",
        description: "Personal data and account deleted upon user request.",
        resumeUrl: "#",
      };
      await settings.save();
    }

    await logout();

    return apiSuccess({
      success: true,
      message: "Admin account and personal data deleted/anonymized successfully.",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete admin account:`, error);
    return apiInternalError(errorId, "Failed to delete account.");
  }
}

