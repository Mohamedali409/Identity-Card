import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalPageViews,
      totalCvDownloads,
      totalVCardSaves,
      recentEvents,
      cvsWithDownloads,
      deviceStats,
    ] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventType: "page_view" } }),
      prisma.analyticsEvent.count({ where: { eventType: "cv_download" } }),
      prisma.analyticsEvent.count({ where: { eventType: "vcard_save" } }),
      prisma.analyticsEvent.findMany({
        orderBy: { timestamp: "desc" },
        take: 20,
      }),
      prisma.cV.findMany({
        select: {
          id: true,
          title: true,
          targetRole: true,
          downloadCount: true,
          isVisible: true,
        },
        orderBy: { downloadCount: "desc" },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["deviceType"],
        _count: {
          _all: true,
        },
      }),
    ]);

    const activeCvCount = cvsWithDownloads.filter((c) => c.isVisible).length;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalPageViews,
          totalCvDownloads,
          totalVCardSaves,
          activeCvCount,
        },
        cvDownloads: cvsWithDownloads,
        recentActivity: recentEvents,
        deviceBreakdown: deviceStats.map((d) => ({
          device: d.deviceType || "desktop",
          count: d._count._all,
        })),
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
