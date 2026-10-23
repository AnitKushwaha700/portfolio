/**
 * GET  /api/hackathon   — List all hackathon entries
 * POST /api/hackathon   — Create a hackathon entry (protected)
 */

import connectToDatabase from "@/lib/db";
import { Hackathon } from "@/models/Hackathon";
import { slugify } from "@/utils";
import {
  apiSuccess,
  apiCreated,
  apiBadRequest,
  apiInternalError,
} from "@/lib/api-response";

export async function GET(): Promise<Response> {
  try {
    await connectToDatabase();
    const hackathons = await Hackathon.find({}).sort({ date: -1 }).lean();
    return apiSuccess({ hackathons });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch hackathons:`, error);
    return apiInternalError(errorId, "Failed to fetch hackathons.");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    await connectToDatabase();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON in request body.");
    }

    if (typeof body !== "object" || body === null) {
      return apiBadRequest("Request body must be a JSON object.");
    }

    const data = body as Record<string, unknown>;

    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      return apiBadRequest("Field 'title' is required.");
    }
    if (
      !data.organization ||
      typeof data.organization !== "string" ||
      !data.organization.trim()
    ) {
      return apiBadRequest("Field 'organization' is required.");
    }

    const title = (data.title as string).trim();

    // Auto-generate slug from title if not provided, ensure uniqueness
    let slug =
      data.slug && typeof data.slug === "string"
        ? (data.slug as string).trim().toLowerCase()
        : slugify(title);

    const existing = await Hackathon.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const hackathon = new Hackathon({
      ...data,
      title,
      organization: (data.organization as string).trim(),
      slug,
    });

    await hackathon.save();
    return apiCreated({
      hackathon: hackathon.toObject(),
      message: "Hackathon record added successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to create hackathon:`, error);
    return apiInternalError(errorId, "Failed to create hackathon.");
  }
}
