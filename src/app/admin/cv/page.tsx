"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Download,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  HardDrive,
  RefreshCw,
  X,
  Upload,
} from "lucide-react";

interface CVData {
  id: string;
  title: string;
  targetRole: string;
  description: string;
  tags: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
  downloadCount: number;
  updatedAt: string;
}

export default function AdminCVPage() {
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCv, setEditingCv] = useState<CVData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [order, setOrder] = useState(0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cv");
      const data = await res.json();
      if (data.success) {
        setCvList(data.data);
      }
    } catch (err) {
      console.error("Error loading CVs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const openCreateModal = () => {
    setEditingCv(null);
    setTitle("");
    setTargetRole("");
    setDescription("");
    setTags("");
    setIsFeatured(false);
    setIsVisible(true);
    setOrder(cvList.length + 1);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cv: CVData) => {
    setEditingCv(cv);
    setTitle(cv.title);
    setTargetRole(cv.targetRole);
    setDescription(cv.description);
    setTags(cv.tags);
    setIsFeatured(cv.isFeatured);
    setIsVisible(cv.isVisible);
    setOrder(cv.order);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("targetRole", targetRole);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("isFeatured", String(isFeatured));
    formData.append("isVisible", String(isVisible));
    formData.append("order", String(order));
    if (pdfFile) {
      formData.append("file", pdfFile);
    }

    try {
      let res;
      if (editingCv) {
        res = await fetch(`/api/admin/cv/${editingCv.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        if (!pdfFile) {
          throw new Error("Please select a PDF document to upload.");
        }
        res = await fetch("/api/admin/cv", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");

      setStatusMessage({
        type: "success",
        text: editingCv ? "CV updated successfully!" : "New CV published!",
      });
      setIsModalOpen(false);
      fetchCVs();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to save CV" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/cv/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete CV");

      setStatusMessage({ type: "success", text: "CV removed." });
      fetchCVs();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Delete failed" });
    }
  };

  const toggleVisibility = async (cv: CVData) => {
    try {
      const res = await fetch(`/api/admin/cv/${cv.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !cv.isVisible }),
      });
      if (res.ok) {
        fetchCVs();
      }
    } catch (err) {
      console.error("Toggle visibility failed:", err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return `${Math.round(kb)} KB`;
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-cardBorder/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Smart CV Center Management
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Upload, replace, and configure role-tailored PDF resumes and monitor downloads.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-xs uppercase tracking-wider transition-all shadow-cyan-glow w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tailored CV</span>
        </button>
      </div>

      {/* Alert banner */}
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

      {/* CVs Table Card */}
      <div className="rounded-2xl bg-cyber-card border border-cyber-cardBorder overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyber-cardBorder bg-cyber-darkest/70 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="p-4">Resume Title &amp; Target Role</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Size</th>
                <th className="p-4">Downloads</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-cardBorder/60 text-xs font-mono">
              {cvList.map((cv) => (
                <tr
                  key={cv.id}
                  className="hover:bg-cyber-darkest/40 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyber-darkest border border-cyber-cardBorder text-cyber-cyan">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-white flex items-center gap-1.5">
                          <span>{cv.title}</span>
                          {cv.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-[9px] text-cyber-cyan">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-cyber-azure mt-0.5">
                          {cv.targetRole}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                      {cv.tags}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400">
                    {formatFileSize(cv.fileSize)}
                  </td>

                  <td className="p-4 font-bold text-cyber-cyan">
                    {cv.downloadCount}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleVisibility(cv)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors ${
                        cv.isVisible
                          ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400"
                          : "bg-slate-800 border border-slate-700 text-slate-400"
                      }`}
                    >
                      {cv.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{cv.isVisible ? "Public" : "Hidden"}</span>
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/api/cv/${cv.id}/download`}
                        title="Direct Download"
                        className="p-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-cardBorder border border-cyber-cardBorder text-slate-300 hover:text-cyber-cyan transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => openEditModal(cv)}
                        title="Edit Details & Replace PDF"
                        className="p-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-cardBorder border border-cyber-cardBorder text-slate-300 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cv.id, cv.title)}
                        title="Delete CV"
                        className="p-1.5 rounded-lg bg-cyber-dark hover:bg-red-950/60 border border-cyber-cardBorder hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-cyber-card border border-cyber-cardBorder rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cyber-cardBorder/60">
              <h2 className="text-xl font-display font-bold text-white">
                {editingCv ? "Edit Tailored Resume" : "Upload New Tailored Resume"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-cyber-dark text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">CV Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Backend Developer — Node.js CV"
                    className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Target Job Role</label>
                  <input
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Backend Developer (Node.js)"
                    className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of this resume's specialization..."
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">
                  Relevant Technology Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Node.js, Express, PostgreSQL, Redis, Docker"
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              {/* PDF File Upload */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">
                  {editingCv ? "Replace PDF Document (optional)" : "PDF Document (Required)"}
                </label>
                <div className="p-4 rounded-xl border border-dashed border-cyber-cardBorder bg-cyber-darkest/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-cyber-cyan" />
                    <span className="text-xs font-mono text-slate-300">
                      {pdfFile ? pdfFile.name : (editingCv ? editingCv.fileName : "Select PDF file (max 10MB)")}
                    </span>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-dark border border-cyber-cardBorder text-cyber-cyan text-xs font-mono cursor-pointer transition-colors">
                    <span>Browse</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-cyber-dark border-cyber-cardBorder text-cyber-cyan focus:ring-0"
                  />
                  <span>Mark as Featured CV</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded bg-cyber-dark border-cyber-cardBorder text-cyber-cyan focus:ring-0"
                  />
                  <span>Visible on Public Site</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyber-cardBorder/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyber-darkest hover:bg-cyber-dark border border-cyber-cardBorder text-xs font-mono text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : (editingCv ? "Save Changes" : "Upload & Publish")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
