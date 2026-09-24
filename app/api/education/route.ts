import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Education } from "@/models/Education";

export async function GET() {
  try {
    await connectToDatabase();
    const education = await Education.find({}).sort({
      order: 1,
      startDate: -1,
    });
    return NextResponse.json({ education }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch education" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.institution || !data.degree || !data.score) {
      return NextResponse.json(
        { error: "Institution, degree, and score are required" },
        { status: 400 },
      );
    }

    const education = new Education(data);
    await education.save();
    return NextResponse.json(
      { education, message: "Education added successfully" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
