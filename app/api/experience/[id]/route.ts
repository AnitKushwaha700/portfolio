import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Experience } from "@/models/Experience";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectToDatabase();

    const data = await request.json();

    const experience = await Experience.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { experience, message: "Experience updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(`Failed to update experience ${id}:`, error);
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

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Experience deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete experience ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete experience", errorId },
      { status: 500 },
    );
  }
}
