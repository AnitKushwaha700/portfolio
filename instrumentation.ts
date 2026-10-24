/**
 * Next.js Server Startup Instrumentation.
 * Executes once when the Node.js server starts up.
 *
 * Verifies that all critical environment variables (database URL,
 * auth secret, Cloudinary keys) are defined and valid. Refuses to
 * start if any critical configuration is missing.
 */

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamically import lib/env to execute fail-fast checks
    await import("./lib/env");
  }
}
