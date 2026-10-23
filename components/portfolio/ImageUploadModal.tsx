"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onImageUpdated: (newImageUrl: string) => void;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  currentImage,
  onImageUpdated,
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    currentImage || "/profile/profile.jpg",
  );
  const [customUrl, setCustomUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    setError("");
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    setError("");
    setSelectedFile(null);
    setPreviewUrl(customUrl.trim());
  };

  const handleSaveAndUpload = async () => {
    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      let finalImageUrl = previewUrl;

      // 1. If a local file was selected, upload via /api/upload
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to upload image file.");
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url || uploadData.data?.url;
      } else if (customUrl.trim()) {
        finalImageUrl = customUrl.trim();
      }

      // 2. Save new profileImage in portfolio settings
      // First fetch existing settings to preserve all other hero fields
      const settingsRes = await fetch("/api/settings");
      let heroData = {};
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        heroData = data?.settings?.hero ?? data?.hero ?? data?.data?.hero ?? {};
      }

      const updateRes = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: {
            ...heroData,
            profileImage: finalImageUrl,
          },
        }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update profile settings.");
      }

      setSuccess("Profile picture updated successfully!");
      onImageUpdated(finalImageUrl);

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0c0d16] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-100">
                Upload Profile Image
              </h3>
              <p className="text-xs text-gray-400">
                Change your 3D portfolio avatar image
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status alerts */}
        {error && (
          <div className="mt-4 p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Preview & Drag Area */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-red-500/40 bg-gray-900 shadow-xl shadow-red-500/10">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-32 flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              isDragging
                ? "border-red-500 bg-red-500/10"
                : "border-gray-700 hover:border-gray-600 bg-black/30 hover:bg-black/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
              }}
            />
            <Upload className="w-6 h-6 text-red-400 mb-2" />
            <span className="text-xs font-medium text-gray-300 text-center px-3">
              {selectedFile
                ? selectedFile.name
                : "Click to browse or drag & drop photo"}
            </span>
            <span className="text-[10px] text-gray-500 mt-1">
              Supports PNG, JPG, WebP
            </span>
          </div>
        </div>

        {/* Or enter URL */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
            Or Enter Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/my-photo.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm bg-black/40 border border-gray-800 rounded-lg text-white focus:border-red-500 outline-none"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Preview
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
          <a
            href="/admin/hero"
            target="_blank"
            className="text-xs text-gray-400 hover:text-red-400 transition-colors underline underline-offset-4"
          >
            Open Full Hero Admin
          </a>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndUpload}
              disabled={isUploading}
              className="px-5 py-2 text-xs font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isUploading ? (
                <LoadingSpinner
                  size="sm"
                  variant="white"
                  label="Uploading..."
                />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Apply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
