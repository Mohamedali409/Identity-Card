"use client";

import React, { useState, useEffect } from "react";
import { FolderGit2, Plus, Trash2, Edit2, Check, AlertCircle, X, Github, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setTechnologies("");
    setRepoUrl("https://github.com/Mohamedali409");
    setLiveUrl("");
    setImageUrl("/assets/projects/ecommerce-backend.svg");
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setTechnologies(proj.technologies);
    setRepoUrl(proj.repoUrl || "");
    setLiveUrl(proj.liveUrl || "");
    setImageUrl(proj.imageUrl || "");
    setIsFeatured(proj.isFeatured);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const payload = {
      title,
      description,
      technologies,
      repoUrl: repoUrl || null,
      liveUrl: liveUrl || null,
      imageUrl: imageUrl || null,
      isFeatured,
    };

    try {
      let res;
      if (editingProject) {
        res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingProject.id }),
        });
      } else {
        res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setStatusMessage({ type: "success", text: "Project saved successfully!" });
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Operation failed" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStatusMessage({ type: "success", text: "Project deleted." });
      fetchProjects();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-cardBorder/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Selected Projects Showcase
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Highlight practical engineering architectures, repositories, and live links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-xs uppercase tracking-wider transition-all shadow-cyan-glow w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
            statusMessage.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/60 border-red-500/40 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-cyber-card border border-cyber-cardBorder flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-display font-bold text-white">
                  {proj.title}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="p-1 rounded text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                {proj.description}
              </p>

              <div className="text-[11px] font-mono text-cyber-azure">
                {proj.technologies}
              </div>
            </div>

            <div className="pt-3 border-t border-cyber-cardBorder/60 flex items-center gap-3 text-xs font-mono">
              {proj.repoUrl && (
                <a
                  href={proj.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-400 hover:text-cyber-cyan"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
              )}
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyber-azure hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-cyber-card border border-cyber-cardBorder rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-cardBorder/60">
              <h2 className="text-lg font-display font-bold text-white">
                {editingProject ? "Edit Project" : "Add Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Technologies (comma separated)</label>
                <input
                  type="text"
                  required
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="e.g. Node.js, Express, MongoDB, Docker"
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-cyber-cardBorder/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyber-darkest text-xs font-mono text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyber-cyan text-cyber-darkest font-display font-bold text-xs uppercase"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
