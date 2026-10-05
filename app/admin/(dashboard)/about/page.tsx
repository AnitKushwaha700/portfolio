"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";

interface AboutSettings {
  content: string;
}

export default function AboutAdmin() {
  const [formData, setFormData] = useState<AboutSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData(data.settings.about);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about: formData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess("About section updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <div className="bg-card p-6 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
          About Me Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage the long-form content for your About section.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl"
      >
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            About Content (Markdown supported in future, use plain text for now)
          </label>
          <textarea
            required
            rows={12}
            value={formData.content}
            onChange={(e) => setFormData({ content: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-gray-800 rounded-lg text-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-y"
            placeholder="Write a few paragraphs about your background, passions, and journey as a developer..."
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save About Section
          </button>
        </div>
      </form>
    </div>
  );
}
