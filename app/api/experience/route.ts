import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Experience } from "@/models/Experience";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all experience, sorted by start date (newest first)
    const experience = await Experience.find({}).sort({ startDate: -1 });

    return NextResponse.json({ experience }, { status: 200 });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch experience:`, error);
    return NextResponse.json(
      { error: "Failed to fetch experience", errorId },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const data = await request.json();

    if (!data.role || !data.company || !data.startDate) {
      return NextResponse.json(
        { error: "Role, company, and start date are required" },
        { status: 400 },
      );
    }

    const experience = new Experience(data);
    await experience.save();

    return NextResponse.json(
      { experience, message: "Experience added successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to add experience:`, error);
    return NextResponse.json(
      { error: "Failed to add experience", errorId },
      { status: 500 },
    );
  }
}
