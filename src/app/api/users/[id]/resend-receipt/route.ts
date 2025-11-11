import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { id } = params;
    const { purchaseId } = await req.json();

    const purchase = await prisma.order.findUnique({
      where: { id: purchaseId },
      include: { user: true },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    // Logic to resend the receipt email
    await resend.emails.send({
      from: process.env.ADMIN_EMAIL as string,
      to: purchase.user.email as string,
      subject: "Receipt for your purchase",
      html: `<h1>Receipt</h1><p>Thank you for your purchase of ${purchase.paymentId}</p>`,
    });

    return NextResponse.json({ message: "Receipt resent successfully" });
  } catch (error) {
    console.error("Error resending receipt:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
