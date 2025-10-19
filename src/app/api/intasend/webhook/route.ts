import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("X-IntaSend-Signature");
    const secret = process.env.INTASEND_WEBHOOK_SECRET;

    if (!secret) {
      console.error("IntaSend webhook secret is not configured.");
      return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
    }

    const body = await req.text();

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const calculatedSignature = hmac.digest("hex");

    if (calculatedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
    }

    const data = JSON.parse(body);

    if (data.state === "COMPLETE") {
      const cartId = data.api_ref;
      const paymentId = data.invoice_id;

      const userCart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: { include: { design: true } } },
      });

      if (!userCart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }

      const totalAmount = userCart.items.reduce(
        (acc, item) => acc + item.design.basePrice * item.quantity,
        0
      );

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            userId: userCart.userId,
            amount: totalAmount,
            status: "PAID",
            paymentGateway: "INTASEND",
            paymentId: paymentId,
          },
        });

        await tx.orderItem.createMany({
          data: userCart.items.map((item) => ({
            orderId: order.id,
            designId: item.designId,
            quantity: item.quantity,
          })),
        });

        await tx.cart.delete({ where: { id: userCart.id } });
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("IntaSend webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
