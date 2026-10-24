/**
 * PUT    /api/experience/[id]  — Update an experience entry by ID (protected)
 * DELETE /api/experience/[id]  — Delete an experience entry by ID (protected)
 */

import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Experience } from "@/models/Experience";
import { requireAdminSession } from "@/lib/auth-guard";
import {
  apiSuccess,
  apiBadRequest,
  apiNotFound,
  apiInternalError,
} from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  const { id } = await params;

  if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
    return apiBadRequest("A valid experience ID is required.");
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

    const updated = await Experience.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updated) {
      return apiNotFound("Experience not found.");
    }

    return apiSuccess({
      experience: updated,
      message: "Experience updated successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to update experience "${id}":`, error);
    return apiInternalError(errorId, "Failed to update experience.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  const { id } = await params;

  if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
    return apiBadRequest("A valid experience ID is required.");
  }

  try {
    await connectToDatabase();

    const deleted = await Experience.findByIdAndDelete(id).lean();

    if (!deleted) {
      return apiNotFound("Experience not found.");
    }

    return apiSuccess({ message: "Experience deleted successfully." });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete experience "${id}":`, error);
    return apiInternalError(errorId, "Failed to delete experience.");
  }
}
