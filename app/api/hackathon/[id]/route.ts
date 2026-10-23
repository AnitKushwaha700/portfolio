/**
 * PUT    /api/hackathon/[id]  — Update a hackathon entry by ID (protected)
 * DELETE /api/hackathon/[id]  — Delete a hackathon entry by ID (protected)
 */

import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Hackathon } from "@/models/Hackathon";
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
    return apiBadRequest("A valid hackathon ID is required.");
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

    const updated = await Hackathon.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return apiNotFound("Hackathon not found.");
    }

    return apiSuccess({
      hackathon: updated,
      message: "Hackathon updated successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to update hackathon "${id}":`, error);
    return apiInternalError(errorId, "Failed to update hackathon.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { id } = await params;

  if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
    return apiBadRequest("A valid hackathon ID is required.");
  }

  try {
    await connectToDatabase();

    const deleted = await Hackathon.findByIdAndDelete(id).lean();

    if (!deleted) {
      return apiNotFound("Hackathon not found.");
    }

    return apiSuccess({ message: "Hackathon deleted successfully." });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete hackathon "${id}":`, error);
    return apiInternalError(errorId, "Failed to delete hackathon.");
  }
}
