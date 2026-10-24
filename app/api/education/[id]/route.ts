/**
 * PUT    /api/education/[id]  — Update an education record by ID (protected)
 * DELETE /api/education/[id]  — Delete an education record by ID (protected)
 */

import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Education } from "@/models/Education";
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
  const { id } = await params;

  if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
    return apiBadRequest("A valid education ID is required.");
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

    const updated = await Education.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updated) {
      return apiNotFound("Education record not found.");
    }

    return apiSuccess({
      education: updated,
      message: "Education record updated successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to update education "${id}":`, error);
    return apiInternalError(errorId, "Failed to update education record.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { id } = await params;

  if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
    return apiBadRequest("A valid education ID is required.");
  }

  try {
    await connectToDatabase();

    const deleted = await Education.findByIdAndDelete(id).lean();

    if (!deleted) {
      return apiNotFound("Education record not found.");
    }

    return apiSuccess({ message: "Education record deleted successfully." });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete education "${id}":`, error);
    return apiInternalError(errorId, "Failed to delete education record.");
  }
}
