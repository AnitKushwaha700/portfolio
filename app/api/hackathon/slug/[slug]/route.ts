/**
 * GET /api/hackathon/slug/[slug]  — Fetch a hackathon by slug (public)
 */

import connectToDatabase from "@/lib/db";
import { Hackathon } from "@/models/Hackathon";
import {
  apiSuccess,
  apiBadRequest,
  apiNotFound,
  apiInternalError,
} from "@/lib/api-response";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { slug } = await params;

  if (!slug?.trim()) {
    return apiBadRequest("Slug parameter is required.");
  }

  try {
    await connectToDatabase();

    const hackathon = await Hackathon.findOne({
      slug: slug.trim().toLowerCase(),
      visible: true,
    }).lean();

    if (!hackathon) {
      return apiNotFound("Hackathon not found.");
    }

    return apiSuccess({ hackathon });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(
      `[${errorId}] Failed to fetch hackathon with slug "${slug}":`,
      error,
    );
    return apiInternalError(errorId, "Failed to fetch hackathon.");
  }
}
