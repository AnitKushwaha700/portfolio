"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Loader2 } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools" | "Other";
  proficiency: number;
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    category: "Frontend",
    proficiency: 80,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills);
      }
    } catch (err) {
      console.error("Failed to fetch skills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSkills();
  }, []);

  const handleAdd = () => {
    setEditingSkill(null);
    setFormData({ name: "", icon: "", category: "Frontend", proficiency: 80 });
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      icon: skill.icon || "",
      category: skill.category,
      proficiency: skill.proficiency || 80,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (skill: Skill) => {
    if (confirm(`Are you sure you want to delete "${skill.name}"?`)) {
      try {
        const res = await fetch(`/api/skills/${skill._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          void fetchSkills();
        }
      } catch (err) {
        console.error("Failed to delete skill", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingSkill
        ? `/api/skills/${editingSkill._id}`
        : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

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

      void fetchSkills();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: (skill: Skill) => (
        <div className="font-medium text-gray-200">{skill.name}</div>
      ),
    },
    {
      header: "Category",
      accessor: (skill: Skill) => (
        <span className="px-2.5 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-full">
          {skill.category}
        </span>
      ),
    },
    {
      header: "Proficiency",
      accessor: (skill: Skill) => (
        <div className="flex items-center gap-2 w-32">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${skill.proficiency}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-8 text-right">
            {skill.proficiency}%
          </span>
        </div>
      ),
    },
    {
      header: "Icon",
      accessor: (skill: Skill) => (
        <div
          className="text-gray-400 text-sm truncate max-w-[150px]"
          title={skill.icon}
        >
          {skill.icon ? (
            skill.icon
          ) : (
            <span className="italic text-gray-600">None</span>
          )}
        </div>
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
        title="Skills"
        description="Manage your tech stack, categories, and proficiency levels."
        data={skills}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Skill"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
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
                Skill Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. React.js"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-card border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase flex justify-between">
              <span>Proficiency ({formData.proficiency}%)</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.proficiency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  proficiency: parseInt(e.target.value),
                })
              }
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Icon SVG or URL (Optional)
            </label>
            <input
              type="text"
              placeholder="<svg>...</svg> or URL"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none font-mono text-sm"
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
              {editingSkill ? "Save Changes" : "Add Skill"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
