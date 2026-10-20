import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    let project = await Project.findOne({
      $or: [{ slug: id }, ...(isObjectId ? [{ _id: id }] : [])],
      visible: true,
    }).lean();

    // If not found with visible: true, fallback to general match
    if (!project) {
      project = await Project.findOne({
        $or: [{ slug: id }, ...(isObjectId ? [{ _id: id }] : [])],
      }).lean();
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch project ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project", errorId },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectToDatabase();

    const data = await request.json();

    const project = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { project, message: "Project updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(`Failed to update project ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectToDatabase();

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete project ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete project", errorId },
      { status: 500 },
    );
  }
}
