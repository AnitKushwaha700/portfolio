"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Save } from "lucide-react";

interface HeroSettings {
  name: string;
  role: string;
  description: string;
  profileImage: string;
  resumeUrl: string;
  showButtons: boolean;
  showProfileImage: boolean;
}

export default function HeroAdmin() {
  const [formData, setFormData] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setUploadingImage(true);
    setError("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload image");
      }

      const data = await res.json();
      setFormData({ ...formData, profileImage: data.url });
      setSuccess("Image uploaded successfully! (Don't forget to click Save)");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData(data.settings.hero);
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
        body: JSON.stringify({ hero: formData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess("Hero settings updated successfully!");
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
          Hero Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage the main landing section of your portfolio and your profile
          picture.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Display Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Role / Headline
              </label>
              <input
                required
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase flex justify-between items-center">
                <span>Profile Picture</span>
                {uploadingImage && (
                  <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                )}
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Or paste an image URL..."
                  value={formData.profileImage}
                  onChange={(e) =>
                    setFormData({ ...formData, profileImage: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg border border-gray-800">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 shrink-0">
                {formData.profileImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={formData.profileImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No Img
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400">
                Preview of your current profile picture. You can either upload a
                new one from your device or paste a URL.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400 uppercase">
            Short Description / Bio
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-2 border-t border-gray-800/50 mt-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.showProfileImage ? "bg-indigo-600" : "bg-gray-700"}`}
              onClick={() =>
                setFormData({
                  ...formData,
                  showProfileImage: !formData.showProfileImage,
                })
              }
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.showProfileImage ? "translate-x-4" : "translate-x-0"}`}
              />
            </div>
            <span className="text-sm text-gray-300">Show Profile Image</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.showButtons ? "bg-indigo-600" : "bg-gray-700"}`}
              onClick={() =>
                setFormData({ ...formData, showButtons: !formData.showButtons })
              }
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.showButtons ? "translate-x-4" : "translate-x-0"}`}
              />
            </div>
            <span className="text-sm text-gray-300">Show Action Buttons</span>
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
            Save Hero Settings
          </button>
        </div>
      </form>
    </div>
  );
}
