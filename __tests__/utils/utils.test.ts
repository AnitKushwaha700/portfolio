import { describe, it, expect } from "vitest";
import {
  cn,
  slugify,
  truncate,
  sanitizeString,
  getFileExtension,
  formatDate,
  formatImageUrl,
  isExternalUrl,
  sanitizeUrl,
} from "@/utils";

describe("cn()", () => {
  it("merges class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "other")).toBe("base other");
  });

  it("handles undefined/null gracefully", () => {
    expect(cn(undefined, null, "valid")).toBe("valid");
  });
});

describe("slugify()", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("My Cool Project")).toBe("my-cool-project");
  });

  it("removes special characters", () => {
    expect(slugify("React.js & Node.js!")).toBe("reactjs-nodejs");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("foo  --  bar")).toBe("foo-bar");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  -hello-  ")).toBe("hello");
  });
});

describe("truncate()", () => {
  it("does not truncate if within limit", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates with ellipsis if over limit", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
  });

  it("handles exact length strings", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});

describe("sanitizeString()", () => {
  it("trims leading/trailing whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("collapses internal whitespace", () => {
    expect(sanitizeString("hello   world")).toBe("hello world");
  });

  it("returns empty string for non-string inputs", () => {
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString(undefined)).toBe("");
    expect(sanitizeString(123)).toBe("");
  });
});

describe("getFileExtension()", () => {
  it("returns lowercase extension", () => {
    expect(getFileExtension("Resume.PDF")).toBe("pdf");
  });

  it("returns the whole name for files without a dot separator", () => {
    // split('.').pop() on a string with no dot returns the full string
    expect(getFileExtension("README")).toBe("readme");
  });

  it("handles multiple dots", () => {
    expect(getFileExtension("my.resume.final.pdf")).toBe("pdf");
  });
});

describe("formatDate()", () => {
  it("returns empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("returns the original string for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("formats valid ISO date to Month Year", () => {
    // Note: output depends on system locale; we check structure
    const result = formatDate("2024-01-15");
    expect(result).toMatch(/January 2024/);
  });
});

describe("formatImageUrl()", () => {
  it("converts Google Drive sharing link to direct image URL", () => {
    const input =
      "https://drive.google.com/file/d/1qmrs-eMzs202dSzSoK_7ArONViJEC2My/view?usp=drive_link";
    expect(formatImageUrl(input)).toBe(
      "https://lh3.googleusercontent.com/d/1qmrs-eMzs202dSzSoK_7ArONViJEC2My",
    );
  });

  it("converts Google Drive open id link to direct image URL", () => {
    const input = "https://drive.google.com/open?id=abc123xyz";
    expect(formatImageUrl(input)).toBe(
      "https://lh3.googleusercontent.com/d/abc123xyz",
    );
  });

  it("preserves standard URLs", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
    expect(formatImageUrl(url)).toBe(url);
  });

  it("returns empty string for empty input", () => {
    expect(formatImageUrl("")).toBe("");
    expect(formatImageUrl(undefined)).toBe("");
  });
});

describe("isExternalUrl()", () => {
  it("detects http and https URLs as external", () => {
    expect(isExternalUrl("https://example.com/img.png")).toBe(true);
    expect(isExternalUrl("http://example.com/img.png")).toBe(true);
  });

  it("detects relative paths as internal", () => {
    expect(isExternalUrl("/hero/smoke.jpg")).toBe(false);
    expect(isExternalUrl("profile.png")).toBe(false);
  });
});

describe("sanitizeUrl()", () => {
  it("allows safe http and https URLs", () => {
    expect(sanitizeUrl("https://github.com/test")).toBe(
      "https://github.com/test",
    );
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("allows safe mailto and tel URLs", () => {
    expect(sanitizeUrl("mailto:test@example.com")).toBe(
      "mailto:test@example.com",
    );
    expect(sanitizeUrl("tel:+1234567890")).toBe("tel:+1234567890");
  });

  it("allows safe relative paths and anchors", () => {
    expect(sanitizeUrl("/projects/my-project")).toBe("/projects/my-project");
    expect(sanitizeUrl("#contact")).toBe("#contact");
  });

  it("blocks dangerous javascript: and data: URIs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("#");
    expect(sanitizeUrl("javascript:alert(document.cookie)")).toBe("#");
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("#");
    expect(sanitizeUrl("vbscript:msgbox(1)")).toBe("#");
  });

  it("handles null and undefined safely", () => {
    expect(sanitizeUrl(null)).toBe("#");
    expect(sanitizeUrl(undefined)).toBe("#");
    expect(sanitizeUrl("")).toBe("#");
  });
});

