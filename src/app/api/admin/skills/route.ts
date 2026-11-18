import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return NextResponse.json({ success: true, data: skills });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, proficiencyLabel, order, isVisible } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and Category are required" }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        proficiencyLabel: proficiencyLabel || null,
        order: order || 0,
        isVisible: isVisible !== false,
      },
    });

    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, category, proficiencyLabel, order, isVisible } = body;

    if (!id) {
      return NextResponse.json({ error: "Skill ID required" }, { status: 400 });
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(proficiencyLabel !== undefined && { proficiencyLabel }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
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
      return NextResponse.json({ error: "Skill ID required" }, { status: 400 });
    }

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Skill deleted" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
