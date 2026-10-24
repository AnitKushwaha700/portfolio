/**
 * PUT    /api/skills/[id]  — Update a skill by ID (protected)
 * DELETE /api/skills/[id]  — Delete a skill by ID (protected)
 */

import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Skill } from "@/models/Skill";
import { SKILL_CATEGORIES } from "@/constants";
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
    return apiBadRequest("A valid skill ID is required.");
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

    const data = body as Record<string, unknown>;

    // Validate category if provided
    if (
      data.category !== undefined &&
      !(SKILL_CATEGORIES as readonly string[]).includes(data.category as string)
    ) {
      return apiBadRequest(
        `Invalid category. Must be one of: ${SKILL_CATEGORIES.join(", ")}.`,
      );
    }

    const updated = await Skill.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updated) {
      return apiNotFound("Skill not found.");
    }

    return apiSuccess({
      skill: updated,
      message: "Skill updated successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to update skill "${id}":`, error);
    return apiInternalError(errorId, "Failed to update skill.");
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
    return apiBadRequest("A valid skill ID is required.");
  }

  try {
    await connectToDatabase();

    const deleted = await Skill.findByIdAndDelete(id).lean();

    if (!deleted) {
      return apiNotFound("Skill not found.");
    }

    return apiSuccess({ message: "Skill deleted successfully." });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete skill "${id}":`, error);
    return apiInternalError(errorId, "Failed to delete skill.");
  }
}
