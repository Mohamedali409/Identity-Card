import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [profile, socialLinks, skills, education, projects, siteSetting] =
      await Promise.all([
        prisma.profile.findFirst({ where: { id: "default-profile" } }),
        prisma.socialLink.findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
        }),
        prisma.skill.findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
        }),
        prisma.education.findMany({
          orderBy: { order: "asc" },
        }),
        prisma.project.findMany({
          orderBy: { order: "asc" },
        }),
        prisma.siteSetting.findFirst({ where: { id: "site-config" } }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        socialLinks,
        skills,
        education,
        projects,
        siteSetting,
      },
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile information" },
      { status: 500 }
    );
  }
}
