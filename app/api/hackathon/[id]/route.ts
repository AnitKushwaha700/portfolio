import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Hackathon } from "@/models/Hackathon";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const data = await request.json();

    const hackathon = await Hackathon.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { hackathon, message: "Hackathon updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(`Failed to update hackathon ${id}:`, error);
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
    const hackathon = await Hackathon.findByIdAndDelete(id);

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Hackathon deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete hackathon ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete hackathon", errorId },
      { status: 500 },
    );
  }
}
