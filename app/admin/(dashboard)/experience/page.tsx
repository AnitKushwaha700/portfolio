"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Loader2 } from "lucide-react";

interface Experience {
  _id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

export default function ExperienceAdmin() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    responsibilities: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/experience");
      if (res.ok) {
        const data = await res.json();
        setExperience(data.experience);
      }
    } catch (err) {
      console.error("Failed to fetch experience", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchExperience();
  }, []);

  const handleAdd = () => {
    setEditingExp(null);
    setFormData({
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      role: exp.role || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.startDate
        ? new Date(exp.startDate).toISOString().split("T")[0]
        : "",
      endDate: exp.endDate
        ? new Date(exp.endDate).toISOString().split("T")[0]
        : "",
      current: exp.current || false,
      responsibilities: (exp.responsibilities || []).join("\n"),
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (exp: Experience) => {
    if (
      confirm(`Are you sure you want to delete your role at "${exp.company}"?`)
    ) {
      try {
        const res = await fetch(`/api/experience/${exp._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          void fetchExperience();
        }
      } catch (err) {
        console.error("Failed to delete experience", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...formData,
      responsibilities: formData.responsibilities
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean),
    };

    if (payload.current) {
      payload.endDate = "";
    }

    try {
      const url = editingExp
        ? `/api/experience/${editingExp._id}`
        : "/api/experience";
      const method = editingExp ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setIsModalOpen(false);

      void fetchExperience();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const columns = [
    {
      header: "Role & Company",
      accessor: (exp: Experience) => (
        <div>
          <div className="font-medium text-gray-200">{exp.role}</div>
          <div className="text-xs text-gray-500">
            {exp.company} {exp.location ? `• ${exp.location}` : ""}
          </div>
        </div>
      ),
    },
    {
      header: "Timeline",
      accessor: (exp: Experience) => (
        <div className="text-sm text-gray-300">
          {formatDate(exp.startDate)} —{" "}
          {exp.current ? (
            <span className="text-indigo-400 font-medium">Present</span>
          ) : (
            formatDate(exp.endDate)
          )}
        </div>
      ),
    },
    {
      header: "Highlights",
      accessor: (exp: Experience) => {
        const descLength = exp.responsibilities?.length || 0;
        return (
          <div className="text-sm text-gray-400">
            {descLength} bullet point{descLength !== 1 && "s"}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <DataTable
        title="Experience"
        description="Manage your work history, education, and career timeline."
        data={experience}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Experience"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? "Edit Experience" : "Add New Experience"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Job Title / Role
              </label>
              <input
                required
                type="text"
                placeholder="Software Engineer"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Company / Institution
              </label>
              <input
                required
                type="text"
                placeholder="Google"
                value={formData.company || ""}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Location
            </label>
            <input
              type="text"
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Start Date
              </label>
              <input
                required
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                End Date
              </label>
              <input
                type="date"
                required={!formData.current}
                disabled={formData.current}
                value={formData.current ? "" : formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 pb-2">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) =>
                setFormData({ ...formData, current: e.target.checked })
              }
              className="rounded bg-black/20 border-gray-800 text-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="current" className="text-sm text-gray-300">
              I currently work here
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Description (One bullet per line)
            </label>
            <textarea
              required
              rows={5}
              placeholder="- Developed new features&#10;- Led a team of 5 engineers"
              value={formData.responsibilities}
              onChange={(e) =>
                setFormData({ ...formData, responsibilities: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingExp ? "Save Changes" : "Add Experience"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
