import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const education = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ success: true, data: education });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { institution, degree, fieldOfStudy, startDate, endDate, description, credentialUrl, order } = body;

    if (!institution || !degree || !fieldOfStudy) {
      return NextResponse.json({ error: "Institution, degree, and field are required" }, { status: 400 });
    }

    const item = await prisma.education.create({
      data: {
        institution,
        degree,
        fieldOfStudy,
        startDate: startDate || "",
        endDate: endDate || "",
        description: description || "",
        credentialUrl: credentialUrl || null,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error creating education entry:", error);
    return NextResponse.json({ error: "Failed to create education entry" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, institution, degree, fieldOfStudy, startDate, endDate, description, credentialUrl, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const updated = await prisma.education.update({
      where: { id },
      data: {
        ...(institution && { institution }),
        ...(degree && { degree }),
        ...(fieldOfStudy && { fieldOfStudy }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
        ...(description !== undefined && { description }),
        ...(credentialUrl !== undefined && { credentialUrl }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating education entry:", error);
    return NextResponse.json({ error: "Failed to update education entry" }, { status: 500 });
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

    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Education entry deleted" });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
