"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  Link2,
  ExternalLink,
  Download,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Eye,
  Info,
  Globe,
  Sparkles,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MAX_FILE_SIZE_BYTES } from "@/constants";
import { sanitizeUrl } from "@/utils";

export default function ResumeAdmin() {
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [previewReloadKey, setPreviewReloadKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showSuccessBanner = (msg: string) => {
    setSuccess(msg);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => setSuccess(""), 4000);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const heroSettings =
          data?.settings?.hero ?? data?.hero ?? data?.data?.hero;
        const currentUrl = heroSettings?.resumeUrl || "";
        const cleanUrl = currentUrl === "#" ? "" : currentUrl;
        setResumeUrl(cleanUrl);
        setCustomUrl(cleanUrl);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load resume settings.");
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      setError("Unable to connect to server. Check your network connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSettings();
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, [fetchSettings]);

  const saveResumeToSettings = async (newUrl: string) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero: { resumeUrl: newUrl || "#" },
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update resume settings.");
    }

    const cleanUrl = newUrl === "#" ? "" : newUrl;
    setResumeUrl(cleanUrl);
    setCustomUrl(cleanUrl);
    setPreviewReloadKey((k) => k + 1);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    if (!allowedExtensions.includes(ext)) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`
      );
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      const uploadData = await uploadRes.json();
      const uploadedUrl = uploadData.url;

      if (!uploadedUrl) {
        throw new Error("No URL returned from upload server.");
      }

      await saveResumeToSettings(uploadedUrl);
      showSuccessBanner("Resume uploaded and published to portfolio successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload resume file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      void handleFileUpload(files[0]);
    }
  };

  const handleCustomUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customUrl.trim();

    if (!trimmed) {
      setError("Please enter a valid URL or upload a file.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveResumeToSettings(trimmed);
      showSuccessBanner("Resume URL saved and updated on portfolio!");
    } catch (err: any) {
      setError(err.message || "Failed to save resume link.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearResume = async () => {
    setDeleting(true);
    setError("");
    try {
      await saveResumeToSettings("#");
      setShowConfirmDelete(false);
      showSuccessBanner("Resume removed from portfolio.");
    } catch (err: any) {
      setError(err.message || "Failed to clear resume.");
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!resumeUrl) return;
    try {
      await navigator.clipboard.writeText(resumeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const isPdf =
    resumeUrl &&
    (resumeUrl.toLowerCase().includes(".pdf") ||
      resumeUrl.includes("/digital_portfolio/") ||
      resumeUrl.startsWith("/uploads/"));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <LoadingSpinner
          size="lg"
          label="Loading resume settings..."
          labelPosition="bottom"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Page Header */}
      <div className="bg-card p-6 md:p-8 rounded-2xl border border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
                Resume Management
              </h1>
              <p className="text-xs text-indigo-400 font-medium">
                Admin Dashboard Feature Only
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 pt-1">
            Upload, update, and manage your CV / Resume document. This feeds the
            public &quot;Resume&quot; button in your portfolio&apos;s navigation bar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchSettings();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 transition-colors cursor-pointer"
            title="Reload settings"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1">
            <p className="font-medium">Error</p>
            <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400" />
          <p className="font-medium">{success}</p>
        </div>
      )}

      {/* Current Status Overview Card */}
      <div className="bg-card border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                resumeUrl
                  ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse"
                  : "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              }`}
            />
            <div>
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Current Resume Status
              </h2>
              <p className="text-xs text-gray-400">
                {resumeUrl
                  ? "Active and available to visitors on the portfolio"
                  : "No resume currently configured (Portfolio TopBar button defaults to contact)"}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
              resumeUrl
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {resumeUrl ? (
              <>
                <FileCheck className="w-3.5 h-3.5" />
                Active on Portfolio
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Missing / Unlinked
              </>
            )}
          </span>
        </div>

        {resumeUrl ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1.5 flex-1 min-w-0">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Active Resume URL / Destination
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={resumeUrl}
                  className="w-full font-mono text-xs px-3.5 py-2.5 bg-black/40 border border-gray-800 rounded-xl text-gray-300 select-all outline-none"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 transition-colors cursor-pointer"
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-5 flex-shrink-0">
              <a
                href={sanitizeUrl(resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>

              <a
                href={sanitizeUrl(resumeUrl)}
                download
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gray-400" />
                <span>Download</span>
              </a>

              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 text-sm text-gray-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Upload a PDF document below or provide an external Google Drive link
              to activate the resume button on your site.
            </span>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing Resume */}
      {showConfirmDelete && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-red-300">
              Are you sure you want to remove the current resume?
            </p>
            <p className="text-xs text-red-400/80">
              The &quot;Resume&quot; button in your portfolio header will revert to
              pointing to your contact section until a new resume is added.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={deleting}
              onClick={handleClearResume}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting ? "Removing..." : "Yes, Remove"}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add / Update Resume Panel */}
      <div className="bg-card border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Upload or Change Resume
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Choose whether to upload a document directly to your portfolio cloud
            storage, or link an existing Google Drive / Dropbox share link.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File (PDF / DOCX)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === "link"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>External Link (Google Drive / Cloud)</span>
          </button>
        </div>

        {/* Tab 1: Direct File Upload */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
              }}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => {
                if (!uploading) fileInputRef.current?.click();
              }}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragOver
                  ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                  : "border-gray-800 hover:border-gray-700 bg-black/20 hover:bg-black/30"
              }`}
            >
              <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                {uploading ? (
                  <LoadingSpinner size="lg" variant="primary" />
                ) : (
                  <UploadCloud className="w-8 h-8" />
                )}
              </div>

              {uploading ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-200">
                    Uploading resume to storage...
                  </p>
                  <p className="text-xs text-gray-400">
                    Please wait while the file is processed and published.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-w-sm">
                  <p className="text-sm font-semibold text-gray-200">
                    Click to browse or drag and drop your resume file
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Supports <span className="text-indigo-400 font-medium">PDF, DOC, DOCX</span> formats up to 10 MB.
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-600/20">
                      <FileText className="w-3.5 h-3.5" />
                      Browse Computer
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-black/20 border border-gray-800/80 flex items-start gap-3 text-xs text-gray-400">
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300 font-medium">Automatic Cloud Storage</p>
                <p className="mt-0.5 leading-relaxed">
                  Uploaded resumes are securely stored on Cloudinary (or local server
                  storage in dev mode) and immediately linked to your portfolio&apos;s
                  public resume download button.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Custom External URL */}
        {activeTab === "link" && (
          <form onSubmit={handleCustomUrlSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase">
                Resume Direct / Share URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... or https://..."
                  className="flex-1 px-4 py-2.5 bg-black/30 border border-gray-800 rounded-xl text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm placeholder:text-gray-600 transition-colors"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" variant="white" label="Saving..." />
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>Save Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/20 border border-gray-800/80 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2 text-gray-300 font-medium">
                <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Tip for Google Drive Links:</span>
              </div>
              <p className="leading-relaxed pl-6">
                Make sure file sharing in Google Drive is set to{" "}
                <strong className="text-indigo-400">
                  &quot;Anyone with the link can view&quot;
                </strong>
                , so recruiters and portfolio visitors can access it without
                requiring permission approval.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Live Resume In-Dashboard Preview */}
      <div className="bg-card border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Live Resume Preview
            </h2>
          </div>
          {resumeUrl && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewReloadKey((k) => k + 1)}
                className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload Preview</span>
              </button>
            </div>
          )}
        </div>

        {resumeUrl ? (
          <div className="space-y-3">
            {isPdf ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-black/40">
                <iframe
                  key={previewReloadKey}
                  src={`${resumeUrl}#toolbar=1&navpanes=0`}
                  title="Resume Document Preview"
                  className="w-full h-[640px] border-none"
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-gray-800 bg-black/30 text-center space-y-3">
                <FileText className="w-12 h-12 text-indigo-400 mx-auto opacity-75" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-200">
                    External Resume Link Configured
                  </p>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    This resume is hosted on an external service (Google Drive,
                    Dropbox, or external server). You can verify the link directly.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={sanitizeUrl(resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open External Resume</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 rounded-xl border border-dashed border-gray-800 bg-black/20 text-center space-y-3">
            <FileText className="w-10 h-10 text-gray-600 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-400">
                No Resume Uploaded Yet
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Once you upload a document or link a resume above, an interactive
                preview will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Integration Guide */}
      <div className="p-5 rounded-2xl bg-black/20 border border-gray-800/80 flex items-start gap-3.5 text-xs text-gray-400">
        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-gray-200">
            Portfolio Navigation Integration
          </p>
          <p>
            The resume you manage here is displayed on the public portfolio exclusively
            as a secure viewing and download link in the top-right{" "}
            <span className="text-indigo-400 font-medium">TopBar</span> navigation.
            Public visitors cannot edit or upload files; only authorized
            administrators in this dashboard can manage resume files.
          </p>
        </div>
      </div>
    </div>
  );
}
