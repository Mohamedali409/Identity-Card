"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Plus, Trash2, Edit2, Check, AlertCircle, X, Calendar } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
  credentialUrl?: string | null;
  order: number;
}

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/education");
      const data = await res.json();
      if (data.success) {
        setEducationList(data.data);
      }
    } catch (err) {
      console.error("Error loading education:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Education) => {
    setEditingItem(item);
    setInstitution(item.institution);
    setDegree(item.degree);
    setFieldOfStudy(item.fieldOfStudy);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setDescription(item.description);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const payload = {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    };

    try {
      let res;
      if (editingItem) {
        res = await fetch("/api/admin/education", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingItem.id }),
        });
      } else {
        res = await fetch("/api/admin/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setStatusMessage({ type: "success", text: "Education record saved!" });
      setIsModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete record for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/education?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStatusMessage({ type: "success", text: "Record removed." });
      fetchEducation();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-cardBorder/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Education &amp; Diplomas Management
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Maintain verified academic degrees, professional diplomas, and institutions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-xs uppercase tracking-wider transition-all shadow-cyan-glow w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
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

      {/* List */}
      <div className="space-y-4">
        {educationList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-cyber-card border border-cyber-cardBorder flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-display font-bold text-white">
                  {item.institution}
                </h3>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyber-cyan" />
                  <span>
                    {item.startDate} — {item.endDate}
                  </span>
                </span>
              </div>

              <div className="text-xs font-mono text-cyber-cyan">
                {item.degree} • {item.fieldOfStudy}
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(item)}
                className="p-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-cardBorder text-slate-300 hover:text-white"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.institution)}
                className="p-1.5 rounded-lg bg-cyber-dark hover:bg-red-950/60 text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                {editingItem ? "Edit Credential" : "Add Credential"}
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
                <label className="text-xs font-mono text-slate-300">Institution / Academy</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. El Shorouk Academy"
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Degree</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Bachelor's Degree"
                    className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Field of Study</label>
                  <input
                    type="text"
                    required
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Management Information Systems"
                    className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Start Date / Year</label>
                  <input
                    type="text"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. 2019"
                    className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">End Date / Year</label>
                  <input
                    type="text"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. 2023"
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
                  placeholder="Key coursework, accomplishments, or focus areas..."
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-cyber-cyan"
                />
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
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
