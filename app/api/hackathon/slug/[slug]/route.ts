import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Hackathon } from "@/models/Hackathon";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const hackathon = await Hackathon.findOne({ slug, visible: true }).lean();

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ hackathon }, { status: 200 });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(
      `[${errorId}] Failed to fetch hackathon with slug ${slug}:`,
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch hackathon", errorId },
      { status: 500 },
    );
  }
}
