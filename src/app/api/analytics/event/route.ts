import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, targetId, deviceType } = body;

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const referer = req.headers.get("referer") || undefined;

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        targetId: targetId || null,
        userAgent: userAgent ? userAgent.substring(0, 255) : null,
        deviceType: deviceType || null,
        referer: referer ? referer.substring(0, 255) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging analytics event:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
