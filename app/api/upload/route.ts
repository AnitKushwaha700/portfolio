import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File extensions that should be uploaded as "raw" (served as-is, no processing)
const RAW_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "txt",
  "csv",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
]);

function getExtension(filename: string): string {
  return (filename.split(".").pop() || "").toLowerCase();
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    const originalName = file.name || "upload";
    const extension = getExtension(originalName);
    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "_");

    // Determine if this is a document/file (raw) or an image
    const isRaw = RAW_EXTENSIONS.has(extension);

    // Build the correct MIME type for the data URI
    const mimeType =
      file.type || (isRaw ? "application/octet-stream" : "image/jpeg");
    const fileUri = `data:${mimeType};base64,${base64Data}`;

    // For raw files: include extension in public_id so download URL has it
    // For images: Cloudinary auto-detects format
    const uniqueId = `${baseName}_${Date.now()}`;
    const publicId = isRaw ? `${uniqueId}.${extension}` : uniqueId;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "digital_portfolio",
      resource_type: isRaw ? "raw" : "image",
      public_id: publicId,
    });

    const url = (result as any).secure_url;

    return NextResponse.json(
      { url, message: "File uploaded successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] Failed to upload file:`, error);
    return NextResponse.json(
      { error: "Failed to upload file to Cloudinary", errorId },
      { status: 500 },
    );
  }
}
