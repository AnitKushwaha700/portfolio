/**
 * GET    /api/projects/[id]  — Fetch a single project by ID or slug
 * PUT    /api/projects/[id]  — Update a project by ID (protected)
 * DELETE /api/projects/[id]  — Delete a project by ID (protected)
 */

import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import {
  apiSuccess,
  apiBadRequest,
  apiNotFound,
  apiInternalError,
} from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { id } = await params;

  if (!id?.trim()) {
    return apiBadRequest("Project ID or slug is required.");
  }

  try {
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = {
      $or: [{ slug: id }, ...(isObjectId ? [{ _id: id }] : [])],
    };

    // Prefer visible projects; fall back to any match (for admin preview)
    let project = await Project.findOne({ ...query, visible: true }).lean();
    if (!project) {
      project = await Project.findOne(query).lean();
    }

    if (!project) {
      return apiNotFound("Project not found.");
    }

    return apiSuccess({ project });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch project "${id}":`, error);
    return apiInternalError(errorId, "Failed to fetch project.");
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { id } = await params;

  if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
    return apiBadRequest("A valid project ID is required.");
  }

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

    const updated = await Project.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updated) {
      return apiNotFound("Project not found.");
    }

    return apiSuccess({
      project: updated,
      message: "Project updated successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to update project "${id}":`, error);
    return apiInternalError(errorId, "Failed to update project.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { id } = await params;

  if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
    return apiBadRequest("A valid project ID is required.");
  }

  try {
    await connectToDatabase();

    const deleted = await Project.findByIdAndDelete(id).lean();

    if (!deleted) {
      return apiNotFound("Project not found.");
    }

    return apiSuccess({ message: "Project deleted successfully." });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete project "${id}":`, error);
    return apiInternalError(errorId, "Failed to delete project.");
  }
}
