import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { PortfolioSettings } from "@/models/PortfolioSettings";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await PortfolioSettings.findOne();

    if (!settings) {
      settings = await PortfolioSettings.create({});
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    let settings = await PortfolioSettings.findOne();

    if (!settings) {
      settings = await PortfolioSettings.create(data);
    } else {
      settings = await PortfolioSettings.findByIdAndUpdate(settings._id, data, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json(
      { settings, message: "Settings updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to update settings:`, error);
    return NextResponse.json(
      { error: "Failed to update settings", errorId },
      { status: 500 },
    );
  }
}
