import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const data = await resend.emails.send({
      from: `Contact Form <${adminEmail}>`, // Replace with your verified Resend domain
      to: [adminEmail],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: rgb(51 51 51); line-height: 1.6;">
          <h2 style="color: rgb(0 86 179);">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: rgb(0 86 179); text-decoration: none;">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="margin-top: 15px;"><strong>Message:</strong></p>
          <p style="border-left: 4px solid rgb(0 86 179); padding-left: 10px; margin-left: 5px; background-color: rgb(249 249 249);">${message}</p>
          <p style="margin-top: 20px; font-size: 12px; color: rgb(119 119 119);">This message was sent from the Concept Builders contact form.</p>
        </div>
      `,
    });

    if (data.error) {
      console.error("Resend email error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
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

        const tokens = adminTokens.map((t) => t.token);

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
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
