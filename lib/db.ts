/**
 * MongoDB connection manager for Next.js.
 *
 * Uses a module-level cache to reuse the connection across hot reloads
 * in development, preventing connection pool exhaustion during API route usage.
 */

import mongoose from "mongoose";
import { MONGOOSE_BUFFER_COMMANDS } from "@/constants";

import dns from "node:dns";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __mongoose: MongooseCache | undefined;
}

/**
 * Automatically sanitizes MongoDB connection URIs:
 * 1. Safely percent-encodes special characters in passwords (such as '@' in 'Anikett@7869').
 * 2. Ensures a database name and standard options (?retryWrites=true&w=majority) are present if missing.
 */
function sanitizeMongoUri(uri: string): string {
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.*)@([^/]+)(\/.*)?$/);
  if (match) {
    const [, proto, user, pass, host, rest] = match;
    const encodedPass = encodeURIComponent(decodeURIComponent(pass));
    const dbPath =
      !rest || rest === "/" || rest.trim() === ""
        ? "/portfolio?retryWrites=true&w=majority"
        : rest;
    return `${proto}${user}:${encodedPass}@${host}${dbPath}`;
  }
  return uri;
}

// Use a global variable to cache the connection in development.
// In production, each serverless invocation gets a fresh module scope,
// so we still benefit from connection reuse within the same invocation.
const cached: MongooseCache = globalThis.__mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalThis.__mongoose) {
  globalThis.__mongoose = cached;
}

/**
 * Connects to MongoDB and returns the mongoose instance.
 * Subsequent calls return the cached connection.
 */
async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    throw new Error(
      "[db] Missing MONGODB_URI environment variable. " +
        "Please define it in your hosting provider's Environment Variables (e.g. Vercel Project Settings) or .env file.",
    );
  }

  // Ensure SRV DNS resolution succeeds on Windows/local networks
  if (rawUri.includes("+srv") && typeof dns.setServers === "function") {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
      // Ignore if not supported in environment
    }
  }

  const MONGODB_URI = sanitizeMongoUri(rawUri.trim());

  if (!cached.promise) {
    const isProduction = process.env.NODE_ENV === "production";
    const isLocal =
      MONGODB_URI.includes("localhost") || MONGODB_URI.includes("127.0.0.1");

    if (isProduction && isLocal) {
      console.warn(
        "⚠️  [SECURITY NOTICE] Production runtime is configured with a local MongoDB URI. Use a secured TLS cluster (e.g., MongoDB Atlas) for live deployments.",
      );
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: MONGOOSE_BUFFER_COMMANDS,
      ...(isProduction && !isLocal ? { tls: true } : {}),
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise so the next call retries the connection
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
