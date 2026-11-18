"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Tag,
  Clock,
  HardDrive,
  Sparkles,
  ArrowDownToLine,
  ExternalLink,
} from "lucide-react";

export interface CVItem {
  id: string;
  title: string;
  targetRole: string;
  description: string;
  tags: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isFeatured: boolean;
  downloadCount: number;
  updatedAt: string;
}

interface SmartCVCenterProps {
  cvList: CVItem[];
}

export default function SmartCVCenter({ cvList }: SmartCVCenterProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "PDF";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Current";
    }
  };

  const handleDownload = async (cv: CVItem) => {
    setDownloadingId(cv.id);
    try {
      // Trigger download endpoint which increments download count in DB
      const downloadUrl = `/api/cv/${cv.id}/download`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", cv.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1500);
    }
  };

  return (
    <section id="cv-center" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-cardBorder text-cyber-cyan text-xs font-mono">
          <FileText className="w-3.5 h-3.5" />
          <span>Role-Tailored Resumes</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Download My Resume
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Recruiters and hiring managers can select and download the CV version best aligned with the target role and technical requirements.
        </p>
      </div>

      {/* CV Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cvList.map((cv) => {
          const tagsArray = cv.tags ? cv.tags.split(",").map((t) => t.trim()) : [];

          return (
            <div
              key={cv.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border bg-gradient-to-b from-cyber-card/90 to-cyber-darkest/90 backdrop-blur-md group hover:translate-y-[-3px] ${
                cv.isFeatured
                  ? "border-cyber-cyan/50 shadow-cyan-glow"
                  : "border-cyber-cardBorder hover:border-cyber-azure/40 hover:shadow-card-3d"
              }`}
            >
              {/* Featured Badge */}
              {cv.isFeatured && (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyber-cyan text-cyber-darkest text-[11px] font-display font-extrabold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Profile</span>
                </div>
              )}

              {/* Card Top: Title, Target Role & File info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-cyber-cyan transition-colors">
                      {cv.title}
                    </h3>
                    <div className="inline-block px-2.5 py-0.5 mt-1.5 rounded-md bg-cyber-dark border border-cyber-cardBorder text-cyber-azure font-mono text-xs font-medium">
                      {cv.targetRole}
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyber-darkest border border-cyber-cardBorder flex items-center justify-center text-cyber-cyan">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {cv.description}
                </p>

                {/* Technology Tags */}
                {tagsArray.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tagsArray.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-cyber-dark/80 border border-cyber-cardBorder/60 text-[11px] font-mono text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Bottom: Metadata & Download Button */}
              <div className="mt-6 pt-4 border-t border-cyber-cardBorder/60 flex items-center justify-between gap-4">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-slate-500" />
                    <span>{formatFileSize(cv.fileSize)}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Updated {formatDate(cv.updatedAt)}</span>
                  </span>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(cv)}
                  disabled={downloadingId === cv.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all duration-200 ${
                    cv.isFeatured
                      ? "bg-cyber-cyan text-cyber-darkest hover:bg-white shadow-cyan-glow"
                      : "bg-cyber-card hover:bg-cyber-cyan hover:text-cyber-darkest text-slate-100 border border-cyber-cardBorder"
                  }`}
                >
                  {downloadingId === cv.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
