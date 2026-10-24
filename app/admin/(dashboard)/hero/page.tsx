"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Save, FileUp, ExternalLink } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface HeroSettings {
  name: string;
  role: string;
  headline?: string;
  description: string;
  profileImage: string;
  resumeUrl: string;
  showButtons: boolean;
  showProfileImage: boolean;
  statusText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export default function HeroAdmin() {
  const [formData, setFormData] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setUploadingResume(true);
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
        throw new Error(data.error || "Failed to upload resume file");
      }

      const data = await res.json();
      setFormData({ ...formData, resumeUrl: data.url });
      setSuccess("Resume uploaded successfully! (Remember to click Save Changes)");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

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
          const heroSettings =
            data?.settings?.hero ?? data?.hero ?? data?.data?.hero;
          if (heroSettings) {
            setFormData(heroSettings);
          }
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
        <LoadingSpinner
          size="lg"
          label="Loading hero settings..."
          labelPosition="bottom"
        />
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
                Role / Title
              </label>
              <input
                required
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g. Full-Stack Software Developer"
                className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Status Badge Text
              </label>
              <input
                type="text"
                value={formData.statusText || ""}
                onChange={(e) =>
                  setFormData({ ...formData, statusText: e.target.value })
                }
                placeholder="e.g. Available for Opportunities"
                className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Main Headline
              </label>
              <input
                type="text"
                value={formData.headline || ""}
                onChange={(e) =>
                  setFormData({ ...formData, headline: e.target.value })
                }
                placeholder="Optional (leave blank or enter custom headline)"
                className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase flex justify-between items-center">
                <span>Resume / CV URL</span>
                {uploadingResume && (
                  <LoadingSpinner
                    size="sm"
                    variant="primary"
                    label="Uploading..."
                  />
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.resumeUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, resumeUrl: e.target.value })
                  }
                  placeholder="e.g. /resume.pdf or Google Drive link"
                  className="flex-1 px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
                />
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploadingResume}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg border border-gray-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors whitespace-nowrap"
                  title="Upload Resume File (PDF)"
                >
                  <FileUp className="w-4 h-4 text-indigo-400" />
                  <span>Upload PDF</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="text-gray-500">
                  Accepts PDF, DOC, DOCX up to 10MB.
                </span>
                <Link
                  href="/admin/resume"
                  className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Open Dedicated Resume Center</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase flex justify-between items-center">
                <span>Profile Picture</span>
                {uploadingImage && (
                  <LoadingSpinner
                    size="sm"
                    variant="primary"
                    label="Uploading..."
                  />
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
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
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

        {/* Action Button Custom Labels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Primary Button Text
            </label>
            <input
              type="text"
              value={formData.primaryButtonText || ""}
              onChange={(e) =>
                setFormData({ ...formData, primaryButtonText: e.target.value })
              }
              placeholder="e.g. Explore Projects"
              className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={formData.secondaryButtonText || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secondaryButtonText: e.target.value,
                })
              }
              placeholder="e.g. Contact Me"
              className="w-full px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-black/20 border border-gray-800 rounded-xl mt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-200">
                Show Profile Image
              </div>
              <div className="text-xs text-gray-500">
                Display avatar on hero section
              </div>
            </div>
            <ToggleSwitch
              checked={formData.showProfileImage}
              onChange={(checked) =>
                setFormData({
                  ...formData,
                  showProfileImage: checked,
                })
              }
              size="sm"
              activeLabel="Visible"
              inactiveLabel="Hidden"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-200">
                Show Action Buttons
              </div>
              <div className="text-xs text-gray-500">
                Display resume & contact buttons
              </div>
            </div>
            <ToggleSwitch
              checked={formData.showButtons}
              onChange={(checked) =>
                setFormData({ ...formData, showButtons: checked })
              }
              size="sm"
              activeLabel="Visible"
              inactiveLabel="Hidden"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            {submitting ? (
              <LoadingSpinner size="sm" variant="white" label="Saving..." />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Hero Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
