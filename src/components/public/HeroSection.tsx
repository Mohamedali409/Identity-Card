"use client";

import React, { useState } from "react";
import InteractiveCard from "@/components/3d/InteractiveCard";
import {
  Download,
  Mail,
  MessageSquare,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

interface HeroSectionProps {
  profile: {
    fullName: string;
    headline: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    whatsapp: string;
    availability: string;
    avatarUrl: string;
  };
  qrCodeUrl?: string;
  onScrollToCV: () => void;
}

export default function HeroSection({
  profile,
  qrCodeUrl,
  onScrollToCV,
}: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveContact = () => {
    window.location.href = "/api/contact/vcard";
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10">
      {/* Top Bar: Brand, Identity Badge & Quick Nav */}
      <header className="flex items-center justify-between py-3 border-b border-cyber-cardBorder/50 mb-8 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center font-display font-black text-sm text-cyber-cyan shadow-cyan-glow">
            MA
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-display font-bold tracking-wider text-white">
              MOHAMED ALI
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              DIGITAL IDENTITY // 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToCV}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-card/80 hover:bg-cyber-card border border-cyber-cardBorder text-xs font-mono text-cyber-azure hover:text-white transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download CV</span>
          </button>

          <a
            href="/admin"
            className="px-3 py-1.5 rounded-lg bg-cyber-darkest/60 hover:bg-cyber-card border border-cyber-cardBorder/60 text-slate-400 hover:text-cyber-cyan text-xs font-mono transition-colors"
          >
            Admin Portal
          </a>
        </div>
      </header>

      {/* Main Hero Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Context, Bio & Quick Contact Actions */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-card/80 border border-cyber-cardBorder w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <span className="text-xs font-mono text-cyber-cyan tracking-wide">
              Official QR Destination
            </span>
            <span className="text-slate-600 font-mono text-xs">•</span>
            <span className="text-xs font-mono text-slate-300">
              {profile.location}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
              {profile.fullName}
            </h1>
            <p className="text-base sm:text-lg font-display font-medium text-cyber-cyan">
              {profile.headline}
            </p>
          </div>

          {/* Concise Professional Bio */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
            {profile.bio}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Download Tailored CV Trigger */}
            <button
              onClick={onScrollToCV}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-sm transition-all duration-200 shadow-cyan-glow hover:shadow-card-active"
            >
              <FileText className="w-4 h-4" />
              <span>Download Tailored CV</span>
            </button>

            {/* Save Contact (vCard) */}
            <button
              onClick={handleSaveContact}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyber-card hover:bg-cyber-cardBorder/80 border border-cyber-cardBorder text-slate-100 font-display font-semibold text-sm transition-all"
            >
              <Download className="w-4 h-4 text-cyber-cyan" />
              <span>Save Contact (vCard)</span>
            </button>

            {/* Copy Email Button with Feedback */}
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyber-darkest/80 hover:bg-cyber-card border border-cyber-cardBorder text-slate-300 hover:text-white font-mono text-xs transition-all"
              title="Copy Email"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{profile.email}</span>
                </>
              )}
            </button>
          </div>

          {/* Verified Credentials Notice */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Credentials • Digilians AI Software Diploma &amp; MIS Graduate</span>
          </div>
        </div>

        {/* Right Column: Interactive 3D Digital Business Card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <InteractiveCard
            profile={profile}
            qrCodeUrl={qrCodeUrl}
            onSaveVCard={handleSaveContact}
          />
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="flex justify-center pt-8">
        <button
          onClick={onScrollToCV}
          aria-label="Scroll down to resume section"
          className="p-2 rounded-full text-slate-500 hover:text-cyber-cyan transition-colors animate-bounce"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
