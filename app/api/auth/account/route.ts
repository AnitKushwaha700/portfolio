import { NextResponse } from "next/server";
import { getSession, logout } from "@/lib/auth";
import { AdminUser } from "@/models/AdminUser";
import connectToDatabase from "@/lib/db";
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectToDatabase();
    await AdminUser.deleteOne({ email: session.email });
    await logout();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
