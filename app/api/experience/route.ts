/**
 * GET  /api/experience   — List all experience entries
 * POST /api/experience   — Create a new experience entry (protected)
 */

import connectToDatabase from "@/lib/db";
import { Experience } from "@/models/Experience";
import {
  apiSuccess,
  apiCreated,
  apiBadRequest,
  apiInternalError,
} from "@/lib/api-response";

export async function GET(): Promise<Response> {
  try {
    await connectToDatabase();
    const experience = await Experience.find({}).sort({ order: 1 }).lean();
    return apiSuccess({ experience });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch experience:`, error);
    return apiInternalError(errorId, "Failed to fetch experience.");
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

    if (!data.role || typeof data.role !== "string" || !data.role.trim()) {
      return apiBadRequest("Field 'role' is required.");
    }
    if (
      !data.company ||
      typeof data.company !== "string" ||
      !data.company.trim()
    ) {
      return apiBadRequest("Field 'company' is required.");
    }
    if (
      !data.startDate ||
      typeof data.startDate !== "string" ||
      !data.startDate.trim()
    ) {
      return apiBadRequest("Field 'startDate' is required.");
    }

    const experience = new Experience({
      ...data,
      role: (data.role as string).trim(),
      company: (data.company as string).trim(),
      startDate: (data.startDate as string).trim(),
    });

    await experience.save();
    return apiCreated({
      experience: experience.toObject(),
      message: "Experience added successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to create experience:`, error);
    return apiInternalError(errorId, "Failed to create experience.");
  }
}
