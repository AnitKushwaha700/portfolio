"use client";

import { useState, useEffect } from "react";
import { Save, Trash2, AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

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

  // Account / Personal Data Deletion states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          const settingsObj = data?.settings ?? data?.data?.settings ?? data;
          if (settingsObj?.sectionVisibility && settingsObj?.seo) {
            setFormData({
              sectionVisibility: settingsObj.sectionVisibility,
              seo: settingsObj.seo,
            });
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

  const handleDeleteAccount = async () => {
    if (confirmInput.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Please type "DELETE" to confirm.');
      return;
    }

    setDeletingAccount(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account.");
      }

      window.location.replace("/admin/login");
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account.");
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner
          size="lg"
          label="Loading portfolio settings..."
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
          General Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage SEO details, visibility of portfolio sections, and personal
          data privacy.
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
                <ToggleSwitch
                  checked={value}
                  onChange={() =>
                    handleToggle(
                      key as keyof GeneralSettings["sectionVisibility"],
                    )
                  }
                  size="sm"
                  activeLabel="Visible"
                  inactiveLabel="Hidden"
                />
              </div>
            ))}
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
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone: Data Privacy & Account Deletion */}
      <div className="bg-card border border-red-500/20 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h2 className="text-lg font-semibold text-white">
            Danger Zone — Privacy & Account Deletion
          </h2>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          In compliance with user privacy standards (Bearer / GDPR Right to be
          Forgotten), you can permanently delete your admin credentials,
          invalidate all sessions, and anonymize all personal data stored in
          this portfolio.
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-200">
              Delete Admin Account & Personal Data
            </p>
            <p className="text-xs text-gray-500">
              Permanently removes credentials and anonymizes personal contact
              details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteModalOpen(true);
              setConfirmInput("");
              setDeleteError("");
            }}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#12131c] border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">
                Confirm Account & Data Deletion
              </h3>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              This action is{" "}
              <strong className="text-red-400">
                permanent and irreversible
              </strong>
              . Your admin user document will be removed, current session
              cookies destroyed, and all personal info in portfolio settings
              will be anonymized.
            </p>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 block">
                Type{" "}
                <span className="font-mono text-red-400 font-bold">DELETE</span>{" "}
                to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 bg-black/40 border border-gray-800 rounded-lg text-white font-mono text-sm focus:border-red-500 outline-none"
              />
            </div>

            {deleteError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  deletingAccount ||
                  confirmInput.trim().toUpperCase() !== "DELETE"
                }
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                {deletingAccount ? (
                  <LoadingSpinner
                    size="sm"
                    variant="white"
                    label="Deleting..."
                  />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm & Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
