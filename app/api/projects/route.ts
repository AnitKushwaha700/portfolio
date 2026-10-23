/**
 * GET  /api/projects      — List all projects (admin: all; public only gets visible)
 * POST /api/projects      — Create a new project (protected)
 */

import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import {
  apiSuccess,
  apiCreated,
  apiBadRequest,
  apiInternalError,
} from "@/lib/api-response";

export async function GET(): Promise<Response> {
  try {
    await connectToDatabase();
    const projects = await Project.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return apiSuccess({ projects });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch projects:`, error);
    return apiInternalError(errorId, "Failed to fetch projects.");
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

    // Validate required fields
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      return apiBadRequest(
        "Field 'title' is required and must be a non-empty string.",
      );
    }
    if (
      !data.description ||
      typeof data.description !== "string" ||
      !data.description.trim()
    ) {
      return apiBadRequest(
        "Field 'description' is required and must be a non-empty string.",
      );
    }
    if (!data.slug || typeof data.slug !== "string" || !data.slug.trim()) {
      return apiBadRequest(
        "Field 'slug' is required and must be a non-empty string.",
      );
    }

    const project = new Project({
      ...data,
      title: (data.title as string).trim(),
      slug: (data.slug as string).trim().toLowerCase(),
      description: (data.description as string).trim(),
    });

    await project.save();
    return apiCreated({
      project: project.toObject(),
      message: "Project created successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to create project:`, error);
    return apiInternalError(errorId, "Failed to create project.");
  }
}
