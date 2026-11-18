import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ success: true, data: links });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { platform, label, url, icon, isVisible, order } = body;

    if (!platform || !label || !url) {
      return NextResponse.json({ error: "Platform, label, and URL are required" }, { status: 400 });
    }

    const link = await prisma.socialLink.create({
      data: {
        platform,
        label,
        url,
        icon: icon || "Link",
        isVisible: isVisible !== false,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, platform, label, url, icon, isVisible, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data: {
        ...(platform && { platform }),
        ...(label && { label }),
        ...(url && { url }),
        ...(icon && { icon }),
        ...(isVisible !== undefined && { isVisible }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.socialLink.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Link deleted" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
