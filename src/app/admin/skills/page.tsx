"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Plus, Trash2, Edit2, Check, AlertCircle, Eye, EyeOff, X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiencyLabel?: string | null;
  order: number;
  isVisible: boolean;
}

const CATEGORIES = [
  "Backend & APIs",
  "Frontend & Web",
  "Databases & Cache",
  "Cloud & DevOps",
  "Tools & Practices",
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [proficiencyLabel, setProficiencyLabel] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.success) {
        setSkills(data.data);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setName("");
    setCategory(CATEGORIES[0]);
    setProficiencyLabel("");
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiencyLabel(skill.proficiencyLabel || "");
    setIsVisible(skill.isVisible);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const payload = {
      name,
      category,
      proficiencyLabel: proficiencyLabel || null,
      isVisible,
    };

    try {
      let res;
      if (editingSkill) {
        res = await fetch("/api/admin/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingSkill.id }),
        });
      } else {
        res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setStatusMessage({ type: "success", text: "Skill saved successfully!" });
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Operation failed" });
    }
  };

  const handleDelete = async (id: string, skillName: string) => {
    if (!confirm(`Delete skill "${skillName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStatusMessage({ type: "success", text: "Skill removed." });
      fetchSkills();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-cardBorder/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Technical Skills Management
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Configure categorized technologies, libraries, and core proficiencies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-xs uppercase tracking-wider transition-all shadow-cyan-glow w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
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

      {/* Skills Grouped by Category */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const categorySkills = skills.filter((s) => s.category === cat);
          if (categorySkills.length === 0) return null;

          return (
            <div
              key={cat}
              className="rounded-2xl p-6 bg-cyber-card border border-cyber-cardBorder space-y-4"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-cyber-cardBorder/60">
                <Terminal className="w-4 h-4 text-cyber-cyan" />
                <h2 className="text-base font-display font-bold text-white">
                  {cat} ({categorySkills.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-xl bg-cyber-darkest border border-cyber-cardBorder/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono text-slate-200">
                        {skill.name}
                      </div>
                      {skill.proficiencyLabel && (
                        <span className="text-[10px] font-mono text-slate-500">
                          {skill.proficiencyLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="p-1 rounded text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-cyber-card border border-cyber-cardBorder rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-cardBorder/60">
              <h2 className="text-lg font-display font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add Skill"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Skill Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Redis"
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">
                  Proficiency Label (optional)
                </label>
                <input
                  type="text"
                  value={proficiencyLabel}
                  onChange={(e) => setProficiencyLabel(e.target.value)}
                  placeholder="e.g. Core, Advanced, Proficient"
                  className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded bg-cyber-dark border-cyber-cardBorder text-cyber-cyan focus:ring-0"
                  />
                  <span>Visible on Public Card</span>
                </label>
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
