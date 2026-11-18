"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Rotate3d,
  QrCode,
  UserCheck,
  MapPin,
  Mail,
  MessageSquare,
  Github,
  Linkedin,
  Download,
  Wifi,
  Sparkles,
  ExternalLink,
  Check,
  Copy,
} from "lucide-react";

interface InteractiveCardProps {
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
  onSaveVCard?: () => void;
}

export default function InteractiveCard({
  profile,
  qrCodeUrl,
  onSaveVCard,
}: InteractiveCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;

    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, sheenX, sheenY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="w-full max-w-[560px] mx-auto perspective-1000 px-3 select-none">
      {/* 3D Wrapper */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[1.586/1] min-h-[320px] transition-transform duration-200 ease-out cursor-pointer"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${
            isFlipped ? tilt.rotateY + 180 : tilt.rotateY
          }deg)`,
          transformStyle: "preserve-3d",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        aria-label="Interactive 3D Digital Business Card. Tap or click to flip."
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {/* ========================================================= */}
        {/* FRONT OF CARD                                             */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 rounded-2xl p-5 md:p-7 flex flex-col justify-between overflow-hidden border border-cyber-cardBorder/80 bg-gradient-to-br from-[#0E1628] via-[#090F1C] to-[#040812] shadow-card-3d backface-hidden"
          style={{
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.85),
              0 0 35px rgba(0, 240, 255, 0.12),
              inset 0 1px 1px rgba(255, 255, 255, 0.15)
            `,
          }}
        >
          {/* Holographic Sheen Layer */}
          <div
            className="absolute inset-0 holographic-sheen pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(0, 240, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 25%, transparent 65%)`,
            }}
          />

          {/* Micro-Circuit Background Texture */}
          <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />

          {/* Card Top Row: Chip, NFC & Live Status */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* EMV Microchip Graphic */}
              <div className="relative w-12 h-9 rounded-md overflow-hidden shadow-inner border border-amber-600/60 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5">
                <div className="w-full h-full border border-amber-700/50 rounded flex flex-col justify-between p-1">
                  <div className="w-full h-[1px] bg-amber-800/40 my-auto" />
                  <div className="w-full h-[1px] bg-amber-800/40 my-auto" />
                </div>
              </div>

              {/* Contactless / NFC Wave Icon */}
              <Wifi className="w-5 h-5 text-cyber-cyan/70 rotate-90" />
            </div>

            {/* Live Availability Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-dark/80 border border-cyber-cardBorder shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-medium tracking-wide text-emerald-400">
                {profile.availability || "Open to Opportunities"}
              </span>
            </div>
          </div>

          {/* Card Middle: Profile Portrait, Name & Title */}
          <div className="relative z-10 flex items-center gap-4 my-auto">
            {/* Real Profile Avatar */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-cyber-cyan/50 shadow-cyan-glow flex-shrink-0 bg-cyber-darkest">
              <Image
                src={profile.avatarUrl || "/assets/avatar-mohamed.svg"}
                alt={profile.fullName}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Identity Info */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-white truncate">
                  {profile.fullName}
                </h2>
                <div className="flex-shrink-0 text-cyber-cyan bg-cyber-cyan/10 p-0.5 rounded-full" title="Verified Professional Identity">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs md:text-sm font-medium text-cyber-azure/95 line-clamp-1 mt-0.5 font-display">
                {profile.headline}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-2">
                <MapPin className="w-3.5 h-3.5 text-cyber-cyan flex-shrink-0" />
                <span>{profile.location || "Cairo, Egypt"}</span>
              </div>
            </div>
          </div>

          {/* Card Bottom Row: Developer Code / Stack Badges & Flip Hint */}
          <div className="relative z-10 flex items-end justify-between border-t border-cyber-cardBorder/60 pt-3">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                CARD NO / IDENTIFIER
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
                DEV • 2026 • 409 • NODE
              </span>
            </div>

            {/* Flip Prompt Badge */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>Flip Card</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK OF CARD                                              */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 rounded-2xl p-5 md:p-6 flex flex-col justify-between overflow-hidden border border-cyber-cyan/30 bg-gradient-to-br from-[#090F1C] via-[#050914] to-[#02050A] shadow-card-active backface-hidden rotate-y-180"
          style={{
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.9),
              0 0 30px rgba(0, 240, 255, 0.2),
              inset 0 1px 1px rgba(0, 240, 255, 0.2)
            `,
          }}
        >
          {/* Magnetic Stripe Strip */}
          <div className="absolute top-4 left-0 right-0 h-9 bg-black/80 border-y border-cyber-cardBorder" />

          {/* Top Back Content: Identity Fingerprint */}
          <div className="relative z-10 mt-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-cyber-cyan/80">SHA-256 VERIFIED</span>
            <span className="text-slate-500 font-mono">0x4A9F...2026</span>
          </div>

          {/* Middle Back Content: QR Code + Quick Contact Buttons */}
          <div className="relative z-10 flex items-center justify-between gap-4 my-auto">
            {/* Quick QR Code Container */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2 rounded-xl bg-cyber-darkest border border-cyber-cyan/40 shadow-inner">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code"
                    className="w-20 h-20 md:w-24 md:h-24 rounded object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-cyber-cyan">
                    <QrCode className="w-12 h-12" />
                  </div>
                )}
              </div>
              <span className="text-[9px] font-mono text-cyber-cyan tracking-wider uppercase">
                SCAN TO CONNECT
              </span>
            </div>

            {/* Quick Actions List */}
            <div className="flex-1 flex flex-col gap-2">
              {/* One-Tap Save Contact (vCard) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSaveVCard) {
                    onSaveVCard();
                  } else {
                    window.location.href = "/api/contact/vcard";
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyber-cyan text-cyber-darkest font-display font-bold text-xs hover:bg-white transition-all shadow-cyan-glow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Contact (vCard)</span>
              </button>

              {/* Direct WhatsApp Action */}
              <a
                href={profile.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}` : "https://wa.me/201000000000"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-cyber-dark/80 hover:bg-cyber-dark border border-cyber-cardBorder text-slate-200 text-xs font-mono transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Direct</span>
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              {/* Direct Copy Email */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-cyber-dark/80 hover:bg-cyber-dark border border-cyber-cardBorder text-slate-200 text-xs font-mono transition-colors"
              >
                <span className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-cyber-azure" />
                  <span className="truncate">{profile.email}</span>
                </span>
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500 flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Back Content: Social Links + Return Flip */}
          <div className="relative z-10 flex items-center justify-between border-t border-cyber-cardBorder/60 pt-3">
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Mohamedali409"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="GitHub: Mohamedali409"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/mohamed-ali409/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-cyber-azure transition-colors p-1"
                title="LinkedIn: in/mohamed-ali409"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyber-cardBorder/50 hover:bg-cyber-cardBorder text-slate-300 text-xs font-mono transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>Back to Front</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Hint below card */}
      <div className="mt-3 text-center">
        <p className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan/70" />
          <span>Interactive 3D Card • Tap to flip or rotate with cursor</span>
        </p>
      </div>
    </div>
  );
}
