import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const cv = await prisma.cV.findUnique({
      where: { id },
    });

    if (!cv || !cv.isVisible) {
      return NextResponse.json({ error: "CV not found or unavailable" }, { status: 404 });
    }

    // Increment download count and record analytics event asynchronously
    await Promise.all([
      prisma.cV.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      }),
      prisma.analyticsEvent.create({
        data: {
          eventType: "cv_download",
          targetId: id,
          userAgent: req.headers.get("user-agent") || undefined,
          referer: req.headers.get("referer") || undefined,
        },
      }),
    ]);

    // Resolve file path safely
    let filePath = path.join(process.cwd(), "public", cv.fileUrl.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) {
      // Fallback check in uploads directory
      filePath = path.join(process.cwd(), "public", "uploads", "cv", cv.fileName);
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Physical file missing on server" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": cv.mimeType || "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(cv.fileName)}"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error downloading CV:", error);
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 });
  }
}
