import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    console.log("Testing Resend with API Key:", process.env.RESEND_API_KEY ? "Set" : "Missing");
    
    const { data, error } = await resend.emails.send({
      from: "Concept Builders <support@conceptbuilders.co.ke>",
      to: "omondielvin@gmail.com", // Test email
      subject: "Test Email from Concept Builders",
      html: "<h1>Success!</h1><p>If you receive this, Resend is working correctly.</p>",
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
