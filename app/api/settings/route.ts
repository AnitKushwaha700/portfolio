/**
 * GET /api/settings  — Fetch portfolio settings (creates defaults if not found)
 * PUT /api/settings  — Update portfolio settings (protected)
 *
 * Privacy note: The phone number in social settings is masked in GET responses
 * to prevent PII exposure. The full number is only accessible to authenticated admins.
 */

import connectToDatabase from "@/lib/db";
import { PortfolioSettings } from "@/models/PortfolioSettings";
import {
  apiSuccess,
  apiBadRequest,
  apiInternalError,
} from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { requireAdminSession } from "@/lib/auth-guard";

/** Mask all but the last 4 digits of a phone number for public display. */
function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return "*".repeat(phone.length - 4) + phone.slice(-4);
}

export async function GET(): Promise<Response> {
  try {
    await connectToDatabase();

    // Always work with plain objects (not Mongoose documents) for type safety
    let doc = await PortfolioSettings.findOne().select("-__v").lean<Record<string, unknown>>();

    if (!doc) {
      // Bootstrap: create default settings on first run, then fetch as lean
      await PortfolioSettings.create({});
      doc = await PortfolioSettings.findOne().select("-__v").lean<Record<string, unknown>>();
    }

    if (!doc) {
      return apiInternalError(
        crypto.randomUUID(),
        "Failed to initialise settings.",
      );
    }

    // Check if the requester is an authenticated admin
    const session = await getSession();
    const isAdmin = !!session?.email;

    // Mask phone for public responses to protect PII
    const social = doc.social as Record<string, string> | undefined;
    if (!isAdmin && social?.phone) {
      doc = {
        ...doc,
        social: {
          ...social,
          phone: maskPhone(social.phone),
        },
      };
    }

    return apiSuccess({ settings: doc });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch settings:`, error);
    return apiInternalError(errorId, "Failed to fetch settings.");
  }
}

export async function PUT(request: Request): Promise<Response> {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON in request body.");
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return apiBadRequest("Request body must be a JSON object.");
    }

    const existing = await PortfolioSettings.findOne();

    let updated: Record<string, unknown>;

    if (!existing) {
      const created = await PortfolioSettings.create(body);
      updated = created.toObject() as unknown as Record<string, unknown>;
    } else {
      const bodyObj = body as Record<string, any>;
      const updateData: Record<string, any> = { ...bodyObj };

      const existingObj = (
        typeof existing.toObject === "function" ? existing.toObject() : existing
      ) as Record<string, any>;

      if (bodyObj.hero && existingObj.hero) {
        updateData.hero = { ...existingObj.hero, ...bodyObj.hero };
      }
      if (bodyObj.social && existingObj.social) {
        updateData.social = { ...existingObj.social, ...bodyObj.social };
      }
      if (bodyObj.seo && existingObj.seo) {
        updateData.seo = { ...existingObj.seo, ...bodyObj.seo };
      }
      if (bodyObj.about && existingObj.about) {
        updateData.about = { ...existingObj.about, ...bodyObj.about };
      }
      if (bodyObj.sectionVisibility && existingObj.sectionVisibility) {
        updateData.sectionVisibility = {
          ...existingObj.sectionVisibility,
          ...bodyObj.sectionVisibility,
        };
      }

      const result = await PortfolioSettings.findByIdAndUpdate(
        existing._id,
        updateData,
        { returnDocument: "after", runValidators: true },
      ).lean();

      if (!result) {
        return apiInternalError(crypto.randomUUID(), "Settings update failed.");
      }
      updated = result as unknown as Record<string, unknown>;
    }

    return apiSuccess({
      settings: updated,
      message: "Settings updated successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to update settings:`, error);
    return apiInternalError(errorId, "Failed to update settings.");
  }
}
