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
      const amountPaidKES = data.value;

      const existingOrder = await prisma.order.findUnique({
        where: { paymentId },
      });

      if (existingOrder) {
        return NextResponse.json({ success: true });
      }

      const userCart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: { include: { design: true } }, discount: true },
      });

      if (!userCart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }

      // Fetch USD to KES exchange rate to convert amount back to USD
      const exchangeRateRes = await fetch(`${req.nextUrl.origin}/api/exchange-rate`);
      if (!exchangeRateRes.ok) {
        throw new Error('Failed to fetch exchange rate for order creation');
      }
      const exchangeRateData = await exchangeRateRes.json();
      const usdToKesRate = exchangeRateData.usdToKesRate;

      if (!usdToKesRate) {
        throw new Error('USD to KES exchange rate not available.');
      }

      const amountPaidUSD = parseFloat(amountPaidKES) / usdToKesRate;

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            userId: userCart.userId,
            amount: amountPaidUSD, // Use 'amount' as per existing schema
            status: "PAID",
            paymentGateway: "INTASEND",
            paymentId: paymentId,
            cartId: userCart.id,
            discountCode: userCart.discountCode || null,
            discountAmount: userCart.discountAmount || null,
            discountId: userCart.discountId || null,
          },
        });

        await tx.orderItem.createMany({
          data: userCart.items.map((item) => ({
            orderId: order.id,
            designId: item.designId,
            quantity: item.quantity,
            selectedFileTypes: item.selectedFileTypes,
            selectedExtras: item.selectedExtras, // Pass directly as Json
          })),
        });

        if (userCart.discountId) {
          await tx.discount.update({
            where: { id: userCart.discountId },
            data: {
              uses: {
                increment: 1,
              },
            },
          });
        }

        await tx.notification.create({
          data: {
            userId: userCart.userId,
            title: "Order Created",
            description: `Your order #${order.id} has been created successfully.`,
            icon: "ShoppingCart",
          },
        });

        await tx.cart.delete({ where: { id: userCart.id } });
      });
    } else {
      console.log("Payment failed:", data);
      const cartId = data.api_ref;
      const userCart = await prisma.cart.findUnique({
        where: { id: cartId },
      });
      if (userCart) {
        await prisma.notification.create({
          data: {
            userId: userCart.userId,
            title: "Payment Failed",
            description: `Your payment for order in cart ${cartId} failed.`,
            icon: "AlertTriangle",
          },
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("IntaSend webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
