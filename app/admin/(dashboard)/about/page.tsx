"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AboutSettings {
  content: string;
}

export default function AboutAdmin() {
  const [formData, setFormData] = useState<AboutSettings>({ content: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        setError("");
        const res = await fetch("/api/settings");
        if (!ignore) {
          if (res.ok) {
            const data = await res.json();
            setFormData({
              content: data?.settings?.about?.content ?? "",
            });
          } else {
            const data = await res.json().catch(() => ({}));
            setError(
              data.error || "Failed to fetch about settings from server.",
            );
          }
        }
      } catch (err: any) {
        if (!ignore) {
          console.error("Failed to fetch settings", err);
          setError(
            "Unable to connect to server. Please check your network connection.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchSettings();

    return () => {
      ignore = true;
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, [reloadKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about: formData }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update about settings");
      }

      setSuccess("About section updated successfully!");
      successTimeoutRef.current = setTimeout(() => {
        setSuccess("");
      }, 3500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = formData.content.trim()
    ? formData.content.trim().split(/\s+/).length
    : 0;
  const charCount = formData.content.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner
          size="lg"
          label="Loading about details..."
          labelPosition="bottom"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Header */}
      <div className="bg-card p-6 rounded-2xl border border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            About Me Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your narrative bio and background story displayed on the About section.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 transition-colors cursor-pointer"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 text-gray-400" />
                <span>Hide Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-gray-400" />
                <span>Show Preview</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setReloadKey((k) => k + 1);
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 transition-colors cursor-pointer"
            title="Reload from server"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl"
      >
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <div className="flex-1">
              <p className="font-medium">Error saving about settings</p>
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

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-300">
              About Bio Content
            </label>
            <span className="text-xs text-gray-400 font-mono">
              {wordCount} words &bull; {charCount} chars
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Write your background story, core values, passion for tech, and engineering journey. Multiple paragraphs are preserved with line breaks.
          </p>
          <textarea
            required
            rows={12}
            value={formData.content}
            onChange={(e) => setFormData({ content: e.target.value })}
            className="w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-xl text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-y leading-relaxed text-sm font-normal placeholder:text-gray-600 transition-colors"
            placeholder="Write a few paragraphs about your background, passions, and journey as a developer..."
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-gray-800/80">
          <p className="text-xs text-gray-400">
            Changes will be reflected across your live portfolio immediately upon saving.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer text-sm"
          >
            {submitting ? (
              <LoadingSpinner size="sm" variant="white" label="Saving..." />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save About Section</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Preview Card */}
      {showPreview && (
        <div className="bg-card border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              Live About Bio Preview
            </h2>
            <span className="text-xs text-gray-400">
              Matches public card styling
            </span>
          </div>
          <div className="p-8 md:p-10 border border-gray-800/90 bg-[#0d0e19]/90 backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed relative z-10 font-normal whitespace-pre-line">
              {formData.content.trim() || (
                <span className="text-gray-400 italic">
                  Your bio narrative will appear here once you enter content above...
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
