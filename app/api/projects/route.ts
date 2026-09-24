import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all projects, sorted by creation date
    const projects = await Project.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to fetch projects:`, error);
    return NextResponse.json(
      { error: "Failed to fetch projects", errorId },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const data = await request.json();

    // Validate required fields based on the model
    if (!data.title || !data.description || !data.techStack || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const project = new Project(data);
    await project.save();

    return NextResponse.json(
      { project, message: "Project created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to create project:`, error);
    return NextResponse.json(
      { error: "Failed to create project", errorId },
      { status: 500 },
    );
  }
}
