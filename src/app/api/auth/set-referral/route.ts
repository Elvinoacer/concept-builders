import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { referral } = await req.json();

    if (!referral || typeof referral !== "string") {
      return NextResponse.json({ error: "Invalid referral" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("referral", referral.slice(0, 64), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
