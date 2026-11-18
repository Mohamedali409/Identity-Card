"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, Upload, Check, AlertCircle, Save, RefreshCw } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>({
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    whatsapp: "",
    availability: "",
    avatarUrl: "/assets/avatar-mohamed.svg",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload avatar");

      setProfile((prev: any) => ({ ...prev, avatarUrl: data.avatarUrl }));
      setStatusMessage({ type: "success", text: "Profile image replaced successfully!" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Upload error" });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-500 font-mono text-xs">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        <span>Loading profile data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-cyber-cardBorder/60">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
          Profile Management
        </h1>
        <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
          Edit public personal identity, real profile photo, location, and availability status.
        </p>
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

      {/* Avatar Uploader Section */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-cardBorder flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyber-cyan shadow-cyan-glow bg-cyber-darkest flex-shrink-0">
          <Image
            src={profile.avatarUrl || "/assets/avatar-mohamed.svg"}
            alt="Profile Avatar"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <h2 className="text-base font-display font-bold text-white">
            Profile Portrait / Photo
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Upload your real photo (JPG, PNG, or WEBP, max 5MB). It replaces the digital business card avatar immediately.
          </p>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-darkest hover:bg-cyber-dark border border-cyber-cardBorder text-cyber-cyan text-xs font-mono cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingImage ? "Uploading..." : "Upload New Photo"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-cyber-card border border-cyber-cardBorder space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Availability Status</label>
            <input
              type="text"
              required
              value={profile.availability}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              placeholder="e.g. Available for Opportunities"
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Professional Headline</label>
            <input
              type="text"
              required
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Professional Introduction / Bio</label>
            <textarea
              rows={4}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl p-4 text-xs font-sans text-white focus:outline-none focus:border-cyber-cyan transition-colors leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Location</label>
            <input
              type="text"
              required
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Contact Email</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Phone (vCard)</label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">WhatsApp Number</label>
            <input
              type="text"
              value={profile.whatsapp || ""}
              onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              placeholder="e.g. +20 100 000 0000"
              className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-xs uppercase tracking-wider transition-all shadow-cyan-glow disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
