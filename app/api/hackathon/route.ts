import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Hackathon } from "@/models/Hackathon";

export async function GET() {
  try {
    await connectToDatabase();
    const hackathons = await Hackathon.find({}).sort({ date: -1 });
    return NextResponse.json({ hackathons }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hackathons" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.organization) {
      return NextResponse.json(
        { error: "Title and organization are required" },
        { status: 400 },
      );
    }

    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      // Ensure unique slug
      const existing = await Hackathon.findOne({ slug: data.slug });
      if (existing) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    const hackathon = new Hackathon(data);
    await hackathon.save();
    return NextResponse.json(
      { hackathon, message: "Hackathon added successfully" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
