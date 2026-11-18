import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const existingCv = await prisma.cV.findUnique({ where: { id } });
    if (!existingCv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const contentType = req.headers.get("content-type") || "";
    let updateData: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const title = formData.get("title") as string | null;
      const targetRole = formData.get("targetRole") as string | null;
      const description = formData.get("description") as string | null;
      const tags = formData.get("tags") as string | null;
      const isFeatured = formData.get("isFeatured");
      const isVisible = formData.get("isVisible");
      const order = formData.get("order") as string | null;

      if (title) updateData.title = title;
      if (targetRole) updateData.targetRole = targetRole;
      if (description !== null) updateData.description = description;
      if (tags !== null) updateData.tags = tags;
      if (isFeatured !== null) updateData.isFeatured = isFeatured === "true";
      if (isVisible !== null) updateData.isVisible = isVisible !== "false";
      if (order !== null) updateData.order = parseInt(order, 10);

      // Handle file replacement
      if (file && file.size > 0) {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          return NextResponse.json({ error: "Only PDF documents are allowed." }, { status: 400 });
        }
        if (file.size > MAX_PDF_SIZE_BYTES) {
          return NextResponse.json({ error: "File exceeds 10 MB limit." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
        const sanitizedBase = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const safeFileName = `${crypto.randomUUID().slice(0, 8)}_${sanitizedBase}`;
        const filePath = path.join(uploadDir, safeFileName);
        fs.writeFileSync(filePath, buffer);

        // Delete old physical file if exists
        try {
          const oldPath = path.join(process.cwd(), "public", existingCv.fileUrl.replace(/^\//, ""));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch {}

        updateData.fileUrl = `/uploads/cv/${safeFileName}`;
        updateData.fileName = file.name;
        updateData.fileSize = file.size;
      }
    } else {
      const json = await req.json();
      updateData = { ...json };
    }

    if (updateData.isFeatured) {
      await prisma.cV.updateMany({
        where: { id: { not: id }, isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const updated = await prisma.cV.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating CV:", error);
    return NextResponse.json({ error: "Failed to update CV" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const existing = await prisma.cV.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Try deleting physical file
    try {
      const filePath = path.join(process.cwd(), "public", existing.fileUrl.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {}

    await prisma.cV.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "CV deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV:", error);
    return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 });
  }
}
