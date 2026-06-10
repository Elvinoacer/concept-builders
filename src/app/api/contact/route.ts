import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const brandedEmailShell = (title: string, body: string) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 16px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#141414;border-radius:0;">
      <tr><td style="background:#141414;padding:32px 40px 24px;border-bottom:1px solid rgba(184,147,90,0.25);">
        <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#B8935A;font-weight:500;">Concept Builders · Kenya</p>
        <h1 style="margin:10px 0 0;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#FDFCFA;line-height:1.2;">${title}</h1>
      </td></tr>
      ${body}
      <tr><td style="padding:20px 40px 28px;border-top:1px solid rgba(255,255,255,0.06);"><p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:0.06em;">Received via conceptbuilders.co.ke contact form</p></td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const adminEmail =
      process.env.MAIN_EMAIL ||
      "support@conceptbuilders.co.ke" ||
      "onboarding@resend.dev"; // Replace with actual admin email

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    const adminHtml = brandedEmailShell(
      "New Consultation Request",
      `<tr><td style="padding:32px 40px;">
        <p style="margin:0 0 20px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#B8935A;">Client Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[["Name", safeName], ["Email", `<a href="mailto:${safeEmail}" style="font-size:15px;color:#B8935A;text-decoration:none;">${safeEmail}</a>`], ["Phone / WhatsApp", safePhone], ["Subject", safeSubject]].map(([label, value]) => `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);"><span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);display:block;margin-bottom:3px;">${label}</span><span style="font-size:15px;color:#FDFCFA;font-weight:400;">${value}</span></td></tr>`).join("")}
        </table>
        <div style="margin-top:28px;padding:20px;background:rgba(255,255,255,0.04);border-left:2px solid #B8935A;"><p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.35);">Message</p><p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.75;white-space:pre-wrap;">${safeMessage}</p></div>
      </td></tr>`,
    );

    const data = await resend.emails.send({
      from: `Concept Builders <${adminEmail}>`,
      to: [adminEmail],
      replyTo: email,
      subject: `New Consultation Request: ${subject}`,
      html: adminHtml,
    });

    if (data.error) {
      console.error("Resend email error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const autoReply = await resend.emails.send({
      from: `Concept Builders <${adminEmail}>`,
      to: [email],
      subject: `We've received your request — Concept Builders`,
      html: brandedEmailShell(
        "Request Received",
        `<tr><td style="padding:32px 40px;color:#FDFCFA;"><p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.82);">Hello ${safeName},</p><p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.82);">Thank you for contacting Concept Builders. We have received your consultation request and our team will review the details shortly.</p><div style="margin:24px 0;padding:18px;border-left:2px solid #B8935A;background:rgba(255,255,255,0.04);"><p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.7);">We typically respond within 24 hours with the next best step for your project.</p></div><p style="margin:0;font-size:14px;line-height:1.8;color:rgba(255,255,255,0.72);">Concept Builders Team</p></td></tr>`,
      ),
    });

    if (autoReply.error) {
      console.error("Resend auto-reply error:", autoReply.error);
    }

    // Create notification for admin
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: "New Contact Form Submission",
          description: `New message from ${name}: ${subject}`,
          icon: "Mail",
        },
      });

      // Send Push Notification
      try {
        const { getAdminMessaging } = await import("@/lib/firebase-admin");
        const adminMessaging = getAdminMessaging();

        const adminTokens = await prisma.deviceToken.findMany({
          where: { userId: admin.id },
          select: { token: true },
        });

        const tokens = adminTokens.map((t: { token: string }) => t.token);

        if (tokens.length > 0) {
          await adminMessaging.sendEachForMulticast({
            tokens,
            notification: {
              title: "New Contact Message",
              body: `${name}: ${subject}`,
            },
            data: {
              url: `/admin/messages`, // Assuming there's a messages page, or just link to dashboard
            },
          });
        }
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    }

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
