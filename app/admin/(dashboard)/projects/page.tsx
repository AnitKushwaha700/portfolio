"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { ExternalLink, Code, Loader2 } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  features?: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  slug: string;
  content?: {
    overview?: string;
    problem?: string;
    solution?: string;
    myContribution?: string;
    challenges?: string;
    learning?: string;
  };
  featured: boolean;
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    category: "Full Stack",
    slug: "",
    features: "",
    overview: "",
    problem: "",
    solution: "",
    myContribution: "",
    challenges: "",
    learning: "",
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fetchingGithub, setFetchingGithub] = useState(false);

  const fetchGithubDetails = async () => {
    if (!formData.githubUrl) return;
    const match = formData.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
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

        let techStack = formData.techStack;
        try {
          const langRes = await fetch(data.languages_url);
          if (langRes.ok) {
            const langData = await langRes.json();
            techStack = Object.keys(langData).join(", ");
          }
        } catch {}

        setFormData((prev) => ({
          ...prev,
          title: prev.title || data.name.replace(/[-_]/g, " "),
          description: prev.description || data.description || "",
          liveUrl: prev.liveUrl || data.homepage || "",
          techStack: prev.techStack || techStack,
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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProjects();
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
      category: "Full Stack",
      slug: "",
      features: "",
      overview: "",
      problem: "",
      solution: "",
      myContribution: "",
      challenges: "",
      learning: "",
      featured: false,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      techStack: (project.techStack || []).join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      category: project.category,
      slug: project.slug || "",
      features: (project.features || []).join("\n"),
      overview: project.content?.overview || "",
      problem: project.content?.problem || "",
      solution: project.content?.solution || "",
      myContribution: project.content?.myContribution || "",
      challenges: project.content?.challenges || "",
      learning: project.content?.learning || "",
      featured: project.featured,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        const res = await fetch(`/api/projects/${project._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          void fetchProjects();
        }
      } catch (err) {
        console.error("Failed to delete project", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...formData,
      techStack: formData.techStack
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
    };

    try {
      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

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

      void fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Project",
      accessor: (project: Project) => (
        <div className="flex items-center gap-3">
          {project.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={project.image}
              alt={project.title}
              className="w-10 h-10 rounded-lg object-cover bg-gray-800"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-500">
              No Img
            </div>
          )}
          <div>
            <div className="font-medium text-gray-200">{project.title}</div>
            <div className="text-xs text-gray-500">
              {project.category} {project.featured && "• Featured"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Tech Stack",
      accessor: (project: Project) => {
        const stack = project.techStack || [];
        return (
          <div className="flex flex-wrap gap-1">
            {stack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 text-[10px] bg-gray-800 text-gray-300 rounded-md whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
            {stack.length > 3 && (
              <span className="px-2 py-1 text-[10px] bg-gray-800 text-gray-400 rounded-md">
                +{stack.length - 3}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Links",
      accessor: (project: Project) => (
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Code className="w-4 h-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
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
        title="Projects"
        description="Manage your portfolio projects, their links, and tech stack."
        data={projects}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Project"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Add New Project"}
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
                Title
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
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 bg-card border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              >
                <option>Full Stack</option>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Mobile</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Description
            </label>
            <textarea
              required
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
              Slug (Required for inner page)
            </label>
            <input
              required
              type="text"
              placeholder="my-awesome-project"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Image URL (Hosted link)
            </label>
            <input
              required
              type="url"
              placeholder="https://imgur.com/..."
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase">
              Tech Stack (comma separated)
            </label>
            <input
              required
              type="text"
              placeholder="React, Node.js, MongoDB"
              value={formData.techStack}
              onChange={(e) =>
                setFormData({ ...formData, techStack: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase flex justify-between items-center">
                <span>GitHub URL (Optional)</span>
                {formData.githubUrl && (
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
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Live URL (Optional)
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:border-indigo-500 outline-none"
              />
            </div>
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
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="rounded bg-black/20 border-gray-800 text-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="text-sm text-gray-300">
              Feature this project on the homepage
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
              {editingProject ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
