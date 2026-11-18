import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cvs = await prisma.cV.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      select: {
        id: true,
        title: true,
        targetRole: true,
        description: true,
        tags: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        isFeatured: true,
        downloadCount: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: cvs,
    });
  } catch (error) {
    console.error("Error fetching CVs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch CVs" },
      { status: 500 }
    );
  }
}
