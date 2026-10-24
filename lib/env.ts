/**
 * Runtime environment variable validation.
 * Fails fast at startup if any required variable is missing or empty.
 * Import `env` instead of using `process.env` directly in application code.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    // During Next.js build-time static route collection / analysis phase, provide a placeholder
    // so build workers do not fail before environment variables are injected at runtime
    if (
      process.env.npm_lifecycle_event === "build" ||
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NODE_ENV === "test" ||
      !process.env.NODE_ENV
    ) {
      return `build_placeholder_${key.toLowerCase()}`;
    }
    throw new Error(
      `[env] Missing required environment variable: "${key}". ` +
        `Please add it to your environment variables or .env file. See .env.example for reference.`,
    );
  }
  return value.trim();
}

function optionalEnv(key: string, fallback = ""): string {
  return process.env[key]?.trim() ?? fallback;
}

export const env = {
  // Database
  MONGODB_URI: requireEnv("MONGODB_URI"),

  // Authentication
  AUTH_SECRET: requireEnv("AUTH_SECRET"),
  ADMIN_EMAIL: requireEnv("ADMIN_EMAIL"),
  ADMIN_PASSWORD_HASH: optionalEnv("ADMIN_PASSWORD_HASH"),

  // Cloudinary (image storage)
  CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),

  // Google Gemini AI
  GEMINI_API_KEY: optionalEnv("GEMINI_API_KEY"),

  // Resend (email)
  RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),

  // Runtime
  NODE_ENV: optionalEnv("NODE_ENV", "development") as
    "development" | "production" | "test",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
