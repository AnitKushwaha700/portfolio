/**
 * GET  /api/education   — List all education records
 * POST /api/education   — Create an education record (protected)
 */

import connectToDatabase from "@/lib/db";
import { Education } from "@/models/Education";
import { getSession } from "@/lib/auth";
import { requireAdminSession } from "@/lib/auth-guard";
import {
  apiSuccess,
  apiCreated,
  apiBadRequest,
  apiInternalError,
} from "@/lib/api-response";

export async function GET(): Promise<Response> {
  try {
    await connectToDatabase();
    const session = await getSession();
    const isAdmin = !!session?.email;
    const filter = isAdmin ? {} : { visible: true };

    const education = await Education.find(filter)
      .select("-__v")
      .sort({ order: 1 })
      .lean();
    return apiSuccess({ education });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch education:`, error);
    return apiInternalError(errorId, "Failed to fetch education.");
  }
}

export async function POST(request: Request): Promise<Response> {
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

    if (typeof body !== "object" || body === null) {
      return apiBadRequest("Request body must be a JSON object.");
    }

    const data = body as Record<string, unknown>;

    if (
      !data.institution ||
      typeof data.institution !== "string" ||
      !data.institution.trim()
    ) {
      return apiBadRequest("Field 'institution' is required.");
    }
    if (
      !data.degree ||
      typeof data.degree !== "string" ||
      !data.degree.trim()
    ) {
      return apiBadRequest("Field 'degree' is required.");
    }
    if (!data.score || typeof data.score !== "string" || !data.score.trim()) {
      return apiBadRequest("Field 'score' is required.");
    }

    const education = new Education({
      ...data,
      institution: (data.institution as string).trim(),
      degree: (data.degree as string).trim(),
      score: (data.score as string).trim(),
    });

    await education.save();
    return apiCreated({
      education: education.toObject(),
      message: "Education record added successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to create education record:`, error);
    return apiInternalError(errorId, "Failed to create education record.");
  }
}
