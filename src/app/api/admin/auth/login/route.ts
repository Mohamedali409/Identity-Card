import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-admin";
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${Math.ceil(
            rateCheck.resetInSeconds / 60
          )} minutes before trying again.`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ adminId: admin.id, email: admin.email });

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, email: admin.email },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
