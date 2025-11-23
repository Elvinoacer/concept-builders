import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendPurchaseNotificationEmails } from "@/lib/emails";
import { calculateItemTotal } from "@/lib/calculate-total";
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
      // api_ref format: cart_{cartId}_{timestamp}
      // We need to extract the cartId.
      // If api_ref doesn't match the format (legacy), fallback to using it as is.
      let cartId = data.api_ref;
      if (data.api_ref && data.api_ref.startsWith("cart_")) {
          const parts = data.api_ref.split('_');
          if (parts.length >= 2) {
              cartId = parts[1];
          }
      } else if (data.api_ref && data.api_ref.startsWith("cart-")) {
          // Handle legacy format cart-{cartId}-{timestamp} just in case
           const parts = data.api_ref.split('-');
           if (parts.length >= 2) {
               cartId = parts[1];
           }
      }

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
        console.error(`Cart not found for api_ref: ${data.api_ref}, extracted cartId: ${cartId}`);
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }

      // Fetch USD to KES exchange rate to convert amount back to USD
      // Note: In production, it might be safer to use the rate stored in the cart or a fixed rate, 
      // but fetching current rate is acceptable if volatility is low.
      let usdToKesRate = 130; // Default fallback
      try {
        const exchangeRateRes = await fetch(`${req.nextUrl.origin}/api/exchange-rate`);
        if (exchangeRateRes.ok) {
            const exchangeRateData = await exchangeRateRes.json();
            if (exchangeRateData.usdToKesRate) {
                usdToKesRate = exchangeRateData.usdToKesRate;
            }
        }
      } catch (e) {
          console.error("Failed to fetch exchange rate in webhook, using fallback", e);
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
            cartId: userCart.id, // Store the original cart ID for reference
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
      // Try to extract cartId for notification
      let cartId = data.api_ref;
      if (data.api_ref && data.api_ref.startsWith("cart_")) {
          const parts = data.api_ref.split('_');
          if (parts.length >= 2) {
              cartId = parts[1];
          }
      }

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
