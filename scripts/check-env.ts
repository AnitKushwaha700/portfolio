/**
 * Pre-deployment environment variable checker.
 * Run before deploying to catch missing configuration early.
 *
 * Usage:
 *   npx tsx scripts/check-env.ts
 *
 * Exit codes:
 *   0 — All required variables are present
 *   1 — One or more required variables are missing
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env from project root
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn("⚠️  No .env file found. Checking process.env directly.\n");
}

interface EnvRule {
  key: string;
  required: boolean;
  description: string;
  validate?: (value: string) => string | null; // returns error message or null
}

const ENV_RULES: EnvRule[] = [
  {
    key: "MONGODB_URI",
    required: true,
    description: "MongoDB connection string",
    validate: (v) => {
      if (!v.startsWith("mongodb://") && !v.startsWith("mongodb+srv://")) {
        return "Must start with mongodb:// or mongodb+srv://";
      }
      if (/:\/\/(root:root|admin:admin|test:test|mongodb:mongodb)@/i.test(v)) {
        return "Default database credentials detected! Use a secure unique username and password.";
      }
      if (
        process.env.NODE_ENV === "production" &&
        !v.includes("localhost") &&
        !v.includes("127.0.0.1") &&
        !v.startsWith("mongodb+srv://") &&
        !v.includes("tls=true") &&
        !v.includes("ssl=true")
      ) {
        return "Production remote MongoDB connection must use TLS/SSL (mongodb+srv:// or ?tls=true)";
      }
      return null;
    },
  },
  {
    key: "AUTH_SECRET",
    required: true,
    description: "JWT signing secret",
    validate: (v) =>
      v.length >= 32
        ? null
        : `Must be at least 32 characters (currently ${v.length})`,
  },
  {
    key: "ADMIN_EMAIL",
    required: true,
    description: "Admin login email address",
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Must be a valid email",
  },
  {
    key: "ADMIN_PASSWORD_HASH",
    required: true,
    description: "Bcrypt hash of the admin password",
    validate: (v) =>
      v.startsWith("$2b$") || v.startsWith("$2a$")
        ? null
        : "Must be a valid bcrypt hash (starts with $2b$ or $2a$)",
  },
  {
    key: "CLOUDINARY_CLOUD_NAME",
    required: true,
    description: "Cloudinary cloud name",
  },
  {
    key: "CLOUDINARY_API_KEY",
    required: true,
    description: "Cloudinary API key",
  },
  {
    key: "CLOUDINARY_API_SECRET",
    required: true,
    description: "Cloudinary API secret",
  },
  {
    key: "GEMINI_API_KEY",
    required: false,
    description:
      "Google Gemini AI API key (optional — disables AI features if missing)",
  },
  {
    key: "RESEND_API_KEY",
    required: false,
    description:
      "Resend email API key (optional — disables email features if missing)",
  },
];

// ─── Check ────────────────────────────────────────────────────────────────────

console.log("🔍 Checking environment variables...\n");

let hasErrors = false;

for (const rule of ENV_RULES) {
  const value = process.env[rule.key];
  const prefix = rule.required ? "[REQUIRED]" : "[OPTIONAL]";

  if (!value || value.trim() === "") {
    if (rule.required) {
      console.error(`  ❌ ${prefix} ${rule.key}`);
      console.error(`     ↳ ${rule.description}`);
      console.error(`     ↳ Not set or empty\n`);
      hasErrors = true;
    } else {
      console.log(`  ⚪ ${prefix} ${rule.key} — Not set (${rule.description})`);
    }
    continue;
  }

  if (rule.validate) {
    const validationError = rule.validate(value.trim());
    if (validationError) {
      console.error(`  ❌ ${prefix} ${rule.key}`);
      console.error(`     ↳ ${rule.description}`);
      console.error(`     ↳ Validation failed: ${validationError}\n`);
      hasErrors = true;
      continue;
    }
  }

  console.log(`  ✅ ${prefix} ${rule.key}`);
}

console.log("");

if (hasErrors) {
  console.error(
    "❌ Environment check FAILED. Please fix the errors above before deploying.\n",
  );
  process.exit(1);
} else {
  console.log(
    "✅ All environment variables are correctly configured. Ready to deploy!\n",
  );
  process.exit(0);
}
