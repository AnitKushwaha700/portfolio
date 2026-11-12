import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/github/streak/route";
import { NextRequest } from "next/server";

describe("GitHub Streak API Route", () => {
  it("returns 200 with fallback data for AnitKushwaha700", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/github/streak?username=AnitKushwaha700&year=2026",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.username).toBe("AnitKushwaha700");
    expect(data.totalContributions).toBeGreaterThan(0);
    expect(Array.isArray(data.contributions)).toBe(true);
    expect(data.contributions.length).toBeGreaterThan(0);
    expect(data.currentStreak).toBeGreaterThanOrEqual(1);
    expect(data.longestStreak).toBeGreaterThanOrEqual(1);
  });
});

