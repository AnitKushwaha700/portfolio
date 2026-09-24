"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Loader2 } from "lucide-react";

interface Education {
  _id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate?: string;
  score: string;
  certificateUrl?: string;
  visible: boolean;
  order: number;
}

export default function EducationAdmin() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    location: "",
    startDate: "",
    endDate: "",
    score: "",
    certificateUrl: "",
    visible: true,
    order: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/education");
      if (res.ok) {
        const data = await res.json();
        setEducation(data.education);
      }
    } catch (err) {
      console.error("Failed to fetch education", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchEducation();
  }, []);

  const handleAdd = () => {
    setEditingEdu(null);
    setFormData({
      institution: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: "",
      score: "",
      certificateUrl: "",
      visible: true,
      order: 0,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      location: edu.location || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      score: edu.score || "",
      certificateUrl: edu.certificateUrl || "",
      visible: edu.visible,
      order: edu.order || 0,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (edu: Education) => {
    if (
      confirm(
        `Are you sure you want to delete "${edu.degree}" at "${edu.institution}"?`,
      )
    ) {
      try {
        const res = await fetch(`/api/education/${edu._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          void fetchEducation();
        }
      } catch (err) {
        console.error("Failed to delete education", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingEdu
        ? `/api/education/${editingEdu._id}`
        : "/api/education";
      const method = editingEdu ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setIsModalOpen(false);

      void fetchEducation();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Institution",
      accessor: (edu: Education) => (
        <div>
          <div className="font-medium text-gray-200">{edu.institution}</div>
          <div className="text-xs text-gray-500">{edu.location}</div>
        </div>
      ),
    },
    {
      header: "Degree",
      accessor: (edu: Education) => (
        <div>
          <div className="text-sm text-gray-300">{edu.degree}</div>
          <div className="text-xs text-indigo-400 font-medium">
            Score: {edu.score}
          </div>
        </div>
      ),
    },
    {
      header: "Timeline",
      accessor: (edu: Education) => (
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {edu.startDate} - {edu.endDate}
        </span>
      ),
    },
    {
      header: "Visibility",
      accessor: (edu: Education) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${edu.visible ? "bg-green-500/10 text-green-400" : "bg-gray-800 text-gray-400"}`}
        >
          {edu.visible ? "Visible" : "Hidden"}
        </span>
      ),
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
        title="Education"
        description="Manage your academic background, degrees, and certifications."
        data={education}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Education"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu ? "Edit Education" : "Add New Education"}
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
                Institution Name
              </label>
              <input
                required
                type="text"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Degree / Certification
            </label>
            <input
              required
              type="text"
              placeholder="Bachelor of Technology"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Start Date / Year
              </label>
              <input
                type="text"
                placeholder="2019"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                End Date / Year
              </label>
              <input
                type="text"
                placeholder="2023 or Present"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Score / CGPA
              </label>
              <input
                required
                type="text"
                placeholder="8.5 CGPA"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Order (Display Priority)
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Certificate URL
            </label>
            <input
              type="text"
              placeholder="https://link-to-certificate.com"
              value={formData.certificateUrl}
              onChange={(e) =>
                setFormData({ ...formData, certificateUrl: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.checked })
              }
              className="rounded bg-black/20 border-gray-800 text-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="visible" className="text-sm text-gray-300">
              Visible on portfolio
            </label>
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
              {editingEdu ? "Save Changes" : "Add Education"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
