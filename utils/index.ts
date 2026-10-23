import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names intelligently.
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6")
 * // → "py-2 bg-blue-500 px-6" (px-4 removed, px-6 wins)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Truncates a string to a maximum length with an ellipsis suffix.
 *
 * @example
 * truncate("Hello World", 8) → "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Converts a string to a URL-friendly slug.
 *
 * @example
 * slugify("My Cool Project!") → "my-cool-project"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Sanitizes a string for safe display — strips leading/trailing whitespace
 * and collapses internal whitespace sequences.
 */
export function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

/**
 * Returns the file extension from a filename (lowercased).
 *
 * @example
 * getFileExtension("Resume.PDF") → "pdf"
 */
export function getFileExtension(filename: string): string {
  return (filename.split(".").pop() ?? "").toLowerCase();
}

/**
 * Formats a date string to a human-readable format.
 *
 * @example
 * formatDate("2024-01-15") → "January 2024"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}
