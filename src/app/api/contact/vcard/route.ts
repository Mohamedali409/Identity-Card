import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVCard } from "@/lib/vcard";

export async function GET(req: NextRequest) {
  try {
    const [profile, githubLink, linkedinLink, siteConfig] = await Promise.all([
      prisma.profile.findFirst({ where: { id: "default-profile" } }),
      prisma.socialLink.findFirst({ where: { platform: "github" } }),
      prisma.socialLink.findFirst({ where: { platform: "linkedin" } }),
      prisma.siteSetting.findFirst({ where: { id: "site-config" } }),
    ]);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Log analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: "vcard_save",
        userAgent: req.headers.get("user-agent") || undefined,
        referer: req.headers.get("referer") || undefined,
      },
    }).catch(() => null);

    const vCardString = generateVCard({
      fullName: profile.fullName,
      headline: profile.headline,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone,
      whatsapp: profile.whatsapp,
      location: profile.location,
      websiteUrl: siteConfig?.qrDestinationUrl || "https://github.com/Mohamedali409",
      githubUrl: githubLink?.url || "https://github.com/Mohamedali409",
      linkedinUrl: linkedinLink?.url || "https://www.linkedin.com/in/mohamed-ali409/",
    });

    return new NextResponse(vCardString, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Mohamed_Ali_Contact.vcf"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error generating vCard:", error);
    return NextResponse.json({ error: "Failed to generate contact card" }, { status: 500 });
  }
}
