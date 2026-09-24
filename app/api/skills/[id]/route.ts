import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Skill } from "@/models/Skill";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectToDatabase();

    const data = await request.json();

    const skill = await Skill.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(
      { skill, message: "Skill updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(`Failed to update skill ${id}:`, error);
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

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to delete skill ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete skill", errorId },
      { status: 500 },
    );
  }
}
