import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || "onboarding@resend.dev"; // Replace with actual admin email

    const data = await resend.emails.send({
      from: `Contact Form <${adminEmail}>`, // Replace with your verified Resend domain
      to: [adminEmail],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
          <h2 style="color: #0056b3;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #0056b3; text-decoration: none;">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="margin-top: 15px;"><strong>Message:</strong></p>
          <p style="border-left: 4px solid #0056b3; padding-left: 10px; margin-left: 5px; background-color: #f9f9f9;">${message}</p>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">This message was sent from the Concept Builders contact form.</p>
        </div>
      `,
    });

    if (data.error) {
      console.error("Resend email error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
