import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function POST(req: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { to, subject, message } = await req.json();

    await resend.emails.send({
      from: process.env.ADMIN_EMAIL as string,
      to,
      subject,
      html: message,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
