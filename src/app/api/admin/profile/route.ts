import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findFirst({
    where: { id: "default-profile" },
  });

  return NextResponse.json({ success: true, data: profile });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      fullName,
      headline,
      bio,
      location,
      email,
      phone,
      whatsapp,
      availability,
      chipDesign,
    } = body;

    const updated = await prisma.profile.upsert({
      where: { id: "default-profile" },
      update: {
        ...(fullName && { fullName }),
        ...(headline && { headline }),
        ...(bio && { bio }),
        ...(location && { location }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(availability && { availability }),
        ...(chipDesign && { chipDesign }),
      },
      create: {
        id: "default-profile",
        fullName: fullName || "Mohamed Ali",
        headline: headline || "Full-Stack Developer",
        bio: bio || "",
        location: location || "Cairo, Egypt",
        email: email || "enagmoahed@gmail.com",
        phone: phone || "",
        whatsapp: whatsapp || "",
        availability: availability || "Available for Opportunities",
        chipDesign: chipDesign || "cyber-cyan",
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
