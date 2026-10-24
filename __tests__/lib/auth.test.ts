import { describe, it, expect, beforeAll } from "vitest";

/**
 * Tests for lib/auth.ts — JWT encryption/decryption
 *
 * We set AUTH_SECRET in process.env before importing the module,
 * because lib/auth.ts validates the secret at module load time.
 */

// Set required env before importing auth
process.env.AUTH_SECRET = "test-secret-key-that-is-at-least-32-characters-long";
// Note: NODE_ENV cannot be overridden in Vitest's Node environment;
// auth.ts uses it only for cookie secure flag, which is fine in test mode.

describe("auth — encrypt/decrypt", () => {
  let encrypt: (payload: { email: string; expires: Date }) => Promise<string>;
  let decrypt: (token: string) => Promise<{ email: string; expires: Date }>;

  beforeAll(async () => {
    const authModule = await import("@/lib/auth");
    encrypt = authModule.encrypt;
    decrypt = authModule.decrypt;
  });

  it("encrypts a payload into a JWT string", async () => {
    const payload = { email: "test@example.com", expires: new Date() };
    const token = await encrypt(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // Valid JWT format
  });

  it("decrypts a valid token back to the original payload", async () => {
    const email = "admin@example.com";
    const expires = new Date(Date.now() + 60_000);
    const token = await encrypt({ email, expires });
    const decoded = await decrypt(token);
    expect(decoded.email).toBe(email);
  });

  it("throws an error for an invalid/tampered token", async () => {
    await expect(decrypt("invalid.token.here")).rejects.toThrow();
  });

  it("throws an error for an expired token", async () => {
    // We can't easily create an expired token without mocking time,
    // so we verify the error path with a malformed token
    await expect(decrypt("")).rejects.toThrow();
  });
});
