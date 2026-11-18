import React from "react";
import { prisma } from "@/lib/prisma";
import { generateQRCodeDataUrl } from "@/lib/qr";
import ClientIdentityExperience from "@/components/public/ClientIdentityExperience";

// Dynamic rendering to ensure fresh profile data from admin dashboard
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real verified records from SQLite database
  const [profile, cvList, skills, projects, education, siteSetting] =
    await Promise.all([
      prisma.profile.findFirst({ where: { id: "default-profile" } }),
      prisma.cV.findMany({
        where: { isVisible: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      }),
      prisma.skill.findMany({
        where: { isVisible: true },
        orderBy: { order: "asc" },
      }),
      prisma.project.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.education.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.siteSetting.findFirst({ where: { id: "site-config" } }),
    ]);

  // Fallback defaults if database was just reset
  const safeProfile = profile || {
    id: "default-profile",
    fullName: "Mohamed Ali",
    headline: "Full-Stack Developer | Backend Developer (Node.js) | Software Engineer",
    bio: "Full-Stack Developer focused on building scalable backend systems, modern web applications, and reliable software solutions. Experienced with Node.js, Express.js, React, databases, API development, and cloud technologies.",
    location: "Cairo, Egypt",
    email: "enagmoahed@gmail.com",
    phone: "+20 100 000 0000",
    whatsapp: "+20 100 000 0000",
    availability: "Available for Opportunities",
    avatarUrl: "/assets/avatar-mohamed.svg",
    chipDesign: "cyber-cyan",
    updatedAt: new Date(),
  };

  // Generate QR code pointing to site destination URL
  const qrTarget = siteSetting?.qrDestinationUrl || "http://localhost:3000";
  let qrDataUrl = "";
  try {
    qrDataUrl = await generateQRCodeDataUrl(qrTarget, {
      width: 320,
      margin: 1,
      darkColor: "#00F0FF",
      lightColor: "#030712",
    });
  } catch (err) {
    console.error("QR Code generation error:", err);
  }

  // Convert dates to string for serialization
  const serializedCVs = cvList.map((cv) => ({
    ...cv,
    createdAt: cv.createdAt.toISOString(),
    updatedAt: cv.updatedAt.toISOString(),
  }));

  const serializedProjects = projects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  const serializedSkills = skills.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <ClientIdentityExperience
      profile={safeProfile}
      cvList={serializedCVs}
      skills={serializedSkills}
      projects={serializedProjects}
      education={education}
      qrCodeUrl={qrDataUrl}
    />
  );
}
