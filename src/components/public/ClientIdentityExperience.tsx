"use client";

import React, { useEffect } from "react";
import AmbientScene from "@/components/3d/AmbientScene";
import HeroSection from "@/components/public/HeroSection";
import SmartCVCenter, { CVItem } from "@/components/public/SmartCVCenter";
import TechnicalArsenal, { SkillItem } from "@/components/public/TechnicalArsenal";
import SelectedProjects, { ProjectItem } from "@/components/public/SelectedProjects";
import EducationCredentials, { EducationItem } from "@/components/public/EducationCredentials";
import Footer from "@/components/public/Footer";

interface ClientIdentityProps {
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
  cvList: CVItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  qrCodeUrl: string;
}

export default function ClientIdentityExperience({
  profile,
  cvList,
  skills,
  projects,
  education,
  qrCodeUrl,
}: ClientIdentityProps) {
  // Log page view analytics once on mount
  useEffect(() => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "page_view",
          deviceType: isMobile ? "mobile" : "desktop",
        }),
      }).catch(() => null);
    } catch {}
  }, []);

  const handleScrollToCV = () => {
    const el = document.getElementById("cv-center");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSaveVCard = () => {
    window.location.href = "/api/contact/vcard";
  };

  return (
    <main className="relative min-h-screen bg-cyber-darkest text-slate-100 overflow-hidden">
      {/* 3D Ambient WebGL particle & floating geometry scene */}
      <AmbientScene />

      {/* Hero with 3D Interactive Digital Business Card */}
      <HeroSection
        profile={profile}
        qrCodeUrl={qrCodeUrl}
        onScrollToCV={handleScrollToCV}
      />

      {/* Smart CV Center (Tailored Resume Downloads) */}
      <SmartCVCenter cvList={cvList} />

      {/* Technical Arsenal & Core Stack */}
      <TechnicalArsenal skills={skills} />

      {/* Selected Production Projects */}
      <SelectedProjects projects={projects} />

      {/* Verified Education & Diplomas */}
      <EducationCredentials education={education} />

      {/* Platform Footer */}
      <Footer profile={profile} onSaveVCard={handleSaveVCard} />
    </main>
  );
}
