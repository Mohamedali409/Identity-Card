import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ success: true, data: projects });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, technologies, repoUrl, liveUrl, imageUrl, isFeatured, order } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        technologies: technologies || "",
        repoUrl: repoUrl || null,
        liveUrl: liveUrl || null,
        imageUrl: imageUrl || null,
        isFeatured: isFeatured === true,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, technologies, repoUrl, liveUrl, imageUrl, isFeatured, order } = body;

    if (!id) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(technologies !== undefined && { technologies }),
        ...(repoUrl !== undefined && { repoUrl }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
