import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Education } from "@/models/Education";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const data = await request.json();

    const education = await Education.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { education, message: "Education updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(`Failed to update education ${id}:`, error);
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
    const education = await Education.findByIdAndDelete(id);

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Education deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete education ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete education", errorId },
      { status: 500 },
    );
  }
}
