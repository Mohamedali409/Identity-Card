"use client";

import React from "react";
import {
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Lock,
  QrCode,
  ArrowUp,
  Download,
} from "lucide-react";

interface FooterProps {
  profile: {
    fullName: string;
    headline: string;
    email: string;
    whatsapp: string;
  };
  onSaveVCard: () => void;
}

export default function Footer({ profile, onSaveVCard }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-cyber-cardBorder/60 bg-cyber-darkest/90 relative z-10 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center font-display font-black text-xs text-cyber-cyan">
                MA
              </div>
              <span className="font-display font-bold text-white tracking-wide">
                {profile.fullName}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans max-w-sm">
              Personal Developer Digital Identity Card &bull; Designed for rapid QR scanning, recruiter reviews, and verified skill presentation.
            </p>
          </div>

          {/* Social Links & Quick Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Mohamedali409"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-cyber-card hover:bg-cyber-cardBorder border border-cyber-cardBorder text-slate-300 hover:text-white transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/mohamed-ali409/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-cyber-card hover:bg-cyber-cardBorder border border-cyber-cardBorder text-slate-300 hover:text-cyber-azure transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="p-2.5 rounded-xl bg-cyber-card hover:bg-cyber-cardBorder border border-cyber-cardBorder text-slate-300 hover:text-cyber-cyan transition-colors"
              title="Send Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={onSaveVCard}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono transition-colors"
              title="Save Contact vCard"
            >
              <Download className="w-3.5 h-3.5" />
              <span>vCard</span>
            </button>
          </div>

          {/* Return Top & Admin Link */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyber-cyan transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
            <span className="text-slate-700">|</span>
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cyber-cardBorder/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <span>&copy; {new Date().getFullYear()} Mohamed Ali. All rights reserved.</span>
          <span>Cairo, Egypt &bull; Digital Identity Platform</span>
        </div>
      </div>
    </footer>
  );
}
