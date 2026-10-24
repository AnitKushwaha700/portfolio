import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  COOKIE_NAME,
  SESSION_DURATION_MS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_ATTEMPTS,
  SKILL_CATEGORIES,
  API_PATHS,
} from "@/constants";

describe("constants", () => {
  it("APP_NAME is a non-empty string", () => {
    expect(typeof APP_NAME).toBe("string");
    expect(APP_NAME.length).toBeGreaterThan(0);
  });

  it("COOKIE_NAME is 'session'", () => {
    expect(COOKIE_NAME).toBe("session");
  });

  it("SESSION_DURATION_MS is exactly 24 hours", () => {
    expect(SESSION_DURATION_MS).toBe(24 * 60 * 60 * 1000);
  });

  it("RATE_LIMIT_WINDOW_MS is exactly 1 minute", () => {
    expect(RATE_LIMIT_WINDOW_MS).toBe(60 * 1000);
  });

  it("RATE_LIMIT_MAX_ATTEMPTS is a positive integer", () => {
    expect(RATE_LIMIT_MAX_ATTEMPTS).toBeGreaterThan(0);
    expect(Number.isInteger(RATE_LIMIT_MAX_ATTEMPTS)).toBe(true);
  });

  it("SKILL_CATEGORIES is a non-empty array of strings", () => {
    expect(Array.isArray(SKILL_CATEGORIES)).toBe(true);
    expect(SKILL_CATEGORIES.length).toBeGreaterThan(0);
    SKILL_CATEGORIES.forEach((cat) => {
      expect(typeof cat).toBe("string");
    });
  });

  it("API_PATHS all start with /api/ or /", () => {
    Object.values(API_PATHS).forEach((path) => {
      expect(path.startsWith("/")).toBe(true);
    });
  });
});
