/**
 * POST /api/upload
 * Uploads a file to Cloudinary (preferred) or local storage (fallback).
 *
 * Protected: requires a valid admin session (enforced by middleware).
 * Accepts: multipart/form-data with a "file" field.
 *
 * Privacy: Uploaded files are stored under the "digital_portfolio" folder
 * in Cloudinary. Do NOT upload files containing sensitive/personal data.
 */

import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_FOLDER,
  MAX_FILE_SIZE_BYTES,
  RAW_FILE_EXTENSIONS,
  ALLOWED_FILE_EXTENSIONS,
} from "@/constants";
import { getFileExtension } from "@/utils";
import {
  apiBadRequest,
  apiCreated,
  apiInternalError,
  apiTooManyRequests,
} from "@/lib/api-response";
import { env } from "@/lib/env";
import { requireAdminSession } from "@/lib/auth-guard";

// Rate limiting: max 10 uploads per IP per minute to prevent storage-fill attacks
const uploadRateLimitStore = new Map<string, number[]>();
const UPLOAD_RATE_LIMIT_WINDOW_MS = 60_000;
const UPLOAD_RATE_LIMIT_MAX = 10;

function isUploadRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - UPLOAD_RATE_LIMIT_WINDOW_MS;
  const attempts = (uploadRateLimitStore.get(ip) ?? []).filter((t) => t >= windowStart);
  if (attempts.length >= UPLOAD_RATE_LIMIT_MAX) {
    return true;
  }
  uploadRateLimitStore.set(ip, [...attempts, now]);
  return false;
}

// Configure Cloudinary once at module load using validated env variables.
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request): Promise<Response> {
  // Defense-in-depth: independently verify admin session inside route handler
  const auth = await requireAdminSession();
  if (!auth.authorized) {
    return auth.response;
  }

  // Rate limiting per IP to prevent storage-fill denial of service
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isUploadRateLimited(ip)) {
    return apiTooManyRequests(
      "Upload limit reached. Please wait a minute before uploading more files.",
      60,
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return apiBadRequest("A 'file' field is required in the form data.");
    }

    if (file.size === 0) {
      return apiBadRequest("Uploaded file is empty.");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return apiBadRequest(
        `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
      );
    }

    const originalName = file.name || "upload";
    const extension = getFileExtension(originalName);

    // Enforce strict file extension whitelist to prevent stored XSS and executable files
    if (!extension || !ALLOWED_FILE_EXTENSIONS.has(extension)) {
      return apiBadRequest(
        `File extension "${extension ? `.${extension}` : "unknown"}" is not permitted. Only safe image formats (jpg, png, webp, gif, avif) and documents (pdf, doc, docx) are allowed.`,
      );
    }
    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "_");

    const isRaw = RAW_FILE_EXTENSIONS.has(extension);
    const mimeType =
      file.type || (isRaw ? "application/octet-stream" : "image/jpeg");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const uniqueId = `${baseName}_${Date.now()}`;
    const localFileName = `${uniqueId}${extension ? `.${extension}` : ".bin"}`;

    // Always create a local disk copy for raw documents (PDF, DOCX) or local fallback
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, localFileName), buffer);

    // Default to local URL
    let url = `/uploads/${localFileName}`;

    try {
      const publicId = isRaw ? `${uniqueId}.${extension}` : uniqueId;
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: CLOUDINARY_FOLDER,
        resource_type: isRaw ? "raw" : "image",
        public_id: publicId,
      });

      if (isRaw) {
        // Cloudinary accounts by default restrict PDF/raw file delivery with HTTP 401.
        // Perform a quick verification check on the uploaded URL.
        try {
          const check = await fetch(result.secure_url, { method: "HEAD" });
          if (check.status === 200) {
            url = result.secure_url;
          } else {
            console.warn(
              `[upload] Cloudinary raw file delivery returned ${check.status} (PDF delivery restriction). Using local URL /uploads/${localFileName} for flawless access.`
            );
          }
        } catch {
          // Keep local url
        }
      } else {
        url = result.secure_url;
      }
    } catch (cloudErr) {
      if (process.env.NODE_ENV === "production" && !isRaw) {
        throw cloudErr;
      }
      console.warn(
        "[upload] Cloudinary unavailable, using local file:",
        cloudErr,
      );
    }

    return apiCreated({ url, message: "File uploaded successfully" });
  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to upload file:`, error);
    return apiInternalError(errorId, "Failed to upload file.");
  }
}
