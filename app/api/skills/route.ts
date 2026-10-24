/**
 * GET  /api/skills   — List all skills
 * POST /api/skills   — Create a new skill (protected)
 */

import connectToDatabase from "@/lib/db";
import { Skill } from "@/models/Skill";
import { SKILL_CATEGORIES } from "@/constants";
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

    const skills = await Skill.find(filter)
      .select("-__v")
      .sort({ category: 1, order: 1 })
      .lean();
    return apiSuccess({ skills });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch skills:`, error);
    return apiInternalError(errorId, "Failed to fetch skills.");
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

    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      return apiBadRequest(
        "Field 'name' is required and must be a non-empty string.",
      );
    }
    if (!data.category || typeof data.category !== "string") {
      return apiBadRequest("Field 'category' is required.");
    }
    if (!(SKILL_CATEGORIES as readonly string[]).includes(data.category)) {
      return apiBadRequest(
        `Invalid category. Must be one of: ${SKILL_CATEGORIES.join(", ")}.`,
      );
    }

    const skill = new Skill({
      ...data,
      name: (data.name as string).trim(),
    });

    await skill.save();
    return apiCreated({
      skill: skill.toObject(),
      message: "Skill added successfully",
    });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to create skill:`, error);
    return apiInternalError(errorId, "Failed to create skill.");
  }
}
