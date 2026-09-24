"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";

interface GeneralSettings {
  sectionVisibility: {
    hero: boolean;
    about: boolean;
    skills: boolean;
    experience: boolean;
    projects: boolean;
    education: boolean;
    hackathon: boolean;
    github: boolean;
    contact: boolean;
  };
  seo: {
    title: string;
    description: string;
  };
}

export default function SettingsAdmin() {
  const [formData, setFormData] = useState<GeneralSettings | null>(null);
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
          setFormData({
            sectionVisibility: data.settings.sectionVisibility,
            seo: data.settings.seo,
          });
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
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess("General settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = (
    section: keyof GeneralSettings["sectionVisibility"],
  ) => {
    if (!formData) return;
    setFormData({
      ...formData,
      sectionVisibility: {
        ...formData.sectionVisibility,
        [section]: !formData.sectionVisibility[section],
      },
    });
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
          General Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage SEO details and visibility of portfolio sections.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-gray-800 rounded-2xl p-6 space-y-8 shadow-xl"
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

        {/* SEO Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800 pb-2">
            SEO & Metadata
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Site Title
            </label>
            <input
              required
              type="text"
              value={formData.seo.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, title: e.target.value },
                })
              }
              className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Site Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.seo.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, description: e.target.value },
                })
              }
              className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Section Visibility */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800 pb-2">
            Section Visibility
          </h2>
          <p className="text-xs text-gray-500">
            Toggle which sections appear on your public portfolio page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(formData.sectionVisibility).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-black/20 border border-gray-800 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-300 capitalize">
                  {key}
                </span>
                <div
                  className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${value ? "bg-indigo-600" : "bg-gray-700"}`}
                  onClick={() =>
                    handleToggle(
                      key as keyof GeneralSettings["sectionVisibility"],
                    )
                  }
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${value ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end">
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
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
