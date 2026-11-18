import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, and SVG are accepted." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate safe UUID filename
    const ext = path.extname(file.name).toLowerCase() || (file.type === "image/png" ? ".png" : ".jpg");
    const safeFileName = `avatar_${crypto.randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatar");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/avatar/${safeFileName}`;

    await prisma.profile.update({
      where: { id: "default-profile" },
      data: { avatarUrl: publicUrl },
    });

    return NextResponse.json({
      success: true,
      avatarUrl: publicUrl,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}
