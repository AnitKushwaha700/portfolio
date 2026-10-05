"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Loader2 } from "lucide-react";

interface Hackathon {
  _id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  location: string;
  image: string;
  link?: string;
  certificateUrl?: string;
  technologies?: string[];
  features?: string[];
  content?: {
    overview?: string;
    problem?: string;
    solution?: string;
    myContribution?: string;
    challenges?: string;
    learning?: string;
  };
  slug?: string;
  visible: boolean;
}

export default function HackathonAdmin() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHack, setEditingHack] = useState<Hackathon | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    date: "",
    description: "",
    location: "",
    link: "",
    image: "",
    certificateUrl: "",
    slug: "",
    technologies: "",
    features: "",
    overview: "",
    problem: "",
    solution: "",
    myContribution: "",
    challenges: "",
    learning: "",
    visible: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fetchingGithub, setFetchingGithub] = useState(false);

  const fetchGithubDetails = async () => {
    if (!formData.link) return;
    const match = formData.link.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      alert("Invalid GitHub URL format.");
      return;
    }

    try {
      setFetchingGithub(true);
      const [, owner, repo] = match;
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo.replace(/\.git$/, "")}`,
      );

      if (res.ok) {
        const data = await res.json();

        let technologies = formData.technologies;
        try {
          const langRes = await fetch(data.languages_url);
          if (langRes.ok) {
            const langData = await langRes.json();
            technologies = Object.keys(langData).join(", ");
          }
        } catch {}

        setFormData((prev) => ({
          ...prev,
          title: prev.title || data.name.replace(/[-_]/g, " "),
          description: prev.description || data.description || "",
          technologies: prev.technologies || technologies || "",
          slug: prev.slug || data.name.toLowerCase(),
        }));
      } else {
        alert("Failed to fetch repository details from GitHub.");
      }
    } catch (err) {
      console.error("Failed to fetch from GitHub", err);
      alert("Error connecting to GitHub API.");
    } finally {
      setFetchingGithub(false);
    }
  };

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hackathon");
      if (res.ok) {
        const data = await res.json();
        setHackathons(data.hackathons);
      }
    } catch (err) {
      console.error("Failed to fetch hackathons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchHackathons();
  }, []);

  const handleAdd = () => {
    setEditingHack(null);
    setFormData({
      title: "",
      organization: "",
      date: "",
      description: "",
      location: "",
      link: "",
      image: "",
      certificateUrl: "",
      slug: "",
      technologies: "",
      features: "",
      overview: "",
      problem: "",
      solution: "",
      myContribution: "",
      challenges: "",
      learning: "",
      visible: true,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (hack: Hackathon) => {
    setEditingHack(hack);
    setFormData({
      title: hack.title,
      organization: hack.organization,
      date: hack.date || "",
      description: hack.description || "",
      location: hack.location || "",
      link: hack.link || "",
      image: hack.image || "",
      certificateUrl: hack.certificateUrl || "",
      slug: hack.slug || "",
      technologies: (hack.technologies || []).join(", "),
      features: (hack.features || []).join("\n"),
      overview: hack.content?.overview || "",
      problem: hack.content?.problem || "",
      solution: hack.content?.solution || "",
      myContribution: hack.content?.myContribution || "",
      challenges: hack.content?.challenges || "",
      learning: hack.content?.learning || "",
      visible: hack.visible,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (hack: Hackathon) => {
    if (confirm(`Are you sure you want to delete "${hack.title}"?`)) {
      try {
        const res = await fetch(`/api/hackathon/${hack._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          void fetchHackathons();
        }
      } catch (err) {
        console.error("Failed to delete hackathon", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      title: formData.title,
      organization: formData.organization,
      date: formData.date,
      description: formData.description,
      location: formData.location,
      link: formData.link,
      image: formData.image,
      certificateUrl: formData.certificateUrl,
      slug: formData.slug,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      content: {
        overview: formData.overview,
        problem: formData.problem,
        solution: formData.solution,
        myContribution: formData.myContribution,
        challenges: formData.challenges,
        learning: formData.learning,
      },
      visible: formData.visible,
    };

    try {
      const url = editingHack
        ? `/api/hackathon/${editingHack._id}`
        : "/api/hackathon";
      const method = editingHack ? "PUT" : "POST";

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

      void fetchHackathons();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Hackathon / Event",
      accessor: (hack: Hackathon) => (
        <div className="flex items-center gap-3">
          {hack.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={hack.image}
              alt={hack.title}
              className="w-10 h-10 rounded-lg object-cover bg-gray-800"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-500">
              No Img
            </div>
          )}
          <div>
            <div className="font-medium text-gray-200">{hack.title}</div>
            <div className="text-xs text-gray-500">
              {hack.organization} {hack.location ? `• ${hack.location}` : ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (hack: Hackathon) => (
        <span className="text-sm text-gray-300">{hack.date}</span>
      ),
    },
    {
      header: "Visibility",
      accessor: (hack: Hackathon) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${hack.visible ? "bg-green-500/10 text-green-400" : "bg-gray-800 text-gray-400"}`}
        >
          {hack.visible ? "Visible" : "Hidden"}
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
        title="Hackathons"
        description="Showcase hackathons, competitions, and events you've participated in."
        data={hackathons}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Hackathon"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHack ? "Edit Hackathon" : "Add New Hackathon"}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto px-2"
        >
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Title / Name
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Organization / Host
              </label>
              <input
                required
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Date (e.g. Oct 2023)
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Location (Optional)
              </label>
              <input
                type="text"
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
              Description / Achievement
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Slug (Optional - auto-generated if empty)
            </label>
            <input
              type="text"
              placeholder="my-awesome-hackathon"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase flex justify-between items-center">
                <span>Project Link (GitHub)</span>
                {formData.link && (
                  <button
                    type="button"
                    onClick={fetchGithubDetails}
                    disabled={fetchingGithub}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    {fetchingGithub && (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    )}
                    Auto-fill
                  </button>
                )}
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Image URL (Hosted link)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Certificate URL
            </label>
            <input
              type="url"
              value={formData.certificateUrl}
              onChange={(e) =>
                setFormData({ ...formData, certificateUrl: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1 mt-4">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Technologies (Comma separated)
            </label>
            <input
              type="text"
              placeholder="React, Node.js, Python"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">
              Detailed Inner Content (Optional)
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase">
                  Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.overview}
                  onChange={(e) =>
                    setFormData({ ...formData, overview: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase">
                    The Problem
                  </label>
                  <textarea
                    rows={4}
                    value={formData.problem}
                    onChange={(e) =>
                      setFormData({ ...formData, problem: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase">
                    The Solution
                  </label>
                  <textarea
                    rows={4}
                    value={formData.solution}
                    onChange={(e) =>
                      setFormData({ ...formData, solution: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase">
                  My Contribution
                </label>
                <textarea
                  rows={3}
                  value={formData.myContribution}
                  onChange={(e) =>
                    setFormData({ ...formData, myContribution: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase">
                    Challenges
                  </label>
                  <textarea
                    rows={3}
                    value={formData.challenges}
                    onChange={(e) =>
                      setFormData({ ...formData, challenges: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase">
                    What I Learned
                  </label>
                  <textarea
                    rows={3}
                    value={formData.learning}
                    onChange={(e) =>
                      setFormData({ ...formData, learning: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase">
                  Key Features (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            </div>
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
              {editingHack ? "Save Changes" : "Add Hackathon"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
