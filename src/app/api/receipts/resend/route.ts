import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/emails";

export async function POST(request: NextRequest) {
  const { orderId } = await request.json();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            design: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await sendOrderConfirmationEmail(order);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
