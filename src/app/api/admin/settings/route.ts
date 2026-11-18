import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findFirst({
    where: { id: "site-config" },
  });

  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      siteTitle,
      metaDescription,
      ogImageUrl,
      qrDestinationUrl,
      allowAnalytics,
      currentPassword,
      newPassword,
    } = body;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }

      const admin = await prisma.admin.findUnique({
        where: { id: session.adminId },
      });

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
      }

      const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }

      const newHash = await hashPassword(newPassword);
      await prisma.admin.update({
        where: { id: session.adminId },
        data: { passwordHash: newHash },
      });
    }

    const updatedSettings = await prisma.siteSetting.upsert({
      where: { id: "site-config" },
      update: {
        ...(siteTitle && { siteTitle }),
        ...(metaDescription && { metaDescription }),
        ...(ogImageUrl && { ogImageUrl }),
        ...(qrDestinationUrl && { qrDestinationUrl }),
        ...(allowAnalytics !== undefined && { allowAnalytics }),
      },
      create: {
        id: "site-config",
        siteTitle: siteTitle || "Mohamed Ali — Developer Digital Identity",
        metaDescription: metaDescription || "",
        ogImageUrl: ogImageUrl || "/assets/og-image.png",
        qrDestinationUrl: qrDestinationUrl || "http://localhost:3000",
        allowAnalytics: allowAnalytics !== false,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      passwordUpdated: Boolean(newPassword),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
