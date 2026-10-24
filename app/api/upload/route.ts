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
} from "@/constants";
import { getFileExtension } from "@/utils";
import {
  apiBadRequest,
  apiCreated,
  apiInternalError,
} from "@/lib/api-response";

// Configure Cloudinary once at module load.
// Credentials are validated by lib/env.ts at startup.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request): Promise<Response> {
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
