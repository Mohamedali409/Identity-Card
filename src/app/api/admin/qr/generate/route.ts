import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { generateQRCodeDataUrl, generateQRCodeSVG } from "@/lib/qr";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      url,
      format = "png", // "png" or "svg"
      width = 800,
      margin = 2,
      darkColor = "#00F0FF",
      lightColor = "#04070D",
    } = body;

    let targetUrl = url;
    if (!targetUrl) {
      const setting = await prisma.siteSetting.findFirst({ where: { id: "site-config" } });
      targetUrl = setting?.qrDestinationUrl || "http://localhost:3000";
    }

    if (format === "svg") {
      const svg = await generateQRCodeSVG(targetUrl, {
        width: Math.min(width, 2048),
        margin,
        darkColor,
        lightColor,
      });

      return NextResponse.json({
        success: true,
        format: "svg",
        targetUrl,
        svg,
      });
    }

    const dataUrl = await generateQRCodeDataUrl(targetUrl, {
      width: Math.min(width, 2048),
      margin,
      darkColor,
      lightColor,
    });

    return NextResponse.json({
      success: true,
      format: "png",
      targetUrl,
      dataUrl,
    });
  } catch (error) {
    console.error("QR Generation error:", error);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
