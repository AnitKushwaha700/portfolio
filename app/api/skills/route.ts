import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Skill } from "@/models/Skill";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all skills, sorted by category and then by proficiency
    const skills = await Skill.find({}).sort({ category: 1, proficiency: -1 });

    return NextResponse.json({ skills }, { status: 200 });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch skills:`, error);
    return NextResponse.json(
      { error: "Failed to fetch skills", errorId },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const data = await request.json();

    if (!data.name || !data.category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 },
      );
    }

    const skill = new Skill(data);
    await skill.save();

    return NextResponse.json(
      { skill, message: "Skill added successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to add skill:`, error);
    return NextResponse.json(
      { error: "Failed to add skill", errorId },
      { status: 500 },
    );
  }
}
