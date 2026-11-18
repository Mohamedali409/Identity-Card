import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cvs = await prisma.cV.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ success: true, data: cvs });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const targetRole = formData.get("targetRole") as string;
    const description = (formData.get("description") as string) || "";
    const tags = (formData.get("tags") as string) || "";
    const isFeatured = formData.get("isFeatured") === "true";
    const isVisible = formData.get("isVisible") !== "false";
    const order = parseInt((formData.get("order") as string) || "0", 10);

    if (!file) {
      return NextResponse.json({ error: "PDF resume file is required" }, { status: 400 });
    }
    if (!title || !targetRole) {
      return NextResponse.json({ error: "Title and target role are required" }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF documents are allowed." }, { status: 400 });
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json({ error: "PDF file exceeds the 10 MB limit." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const sanitizedBase = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const safeFileName = `${crypto.randomUUID().slice(0, 8)}_${sanitizedBase}`;
    const filePath = path.join(uploadDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/cv/${safeFileName}`;

    // If featured is true, optionally unfeature other CVs
    if (isFeatured) {
      await prisma.cV.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const newCv = await prisma.cV.create({
      data: {
        title,
        targetRole,
        description,
        tags,
        fileUrl: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: "application/pdf",
        isFeatured,
        isVisible,
        order,
      },
    });

    return NextResponse.json({ success: true, data: newCv });
  } catch (error) {
    console.error("Error creating CV:", error);
    return NextResponse.json({ error: "Failed to create CV entry" }, { status: 500 });
  }
}
