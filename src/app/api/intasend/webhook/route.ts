import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendPurchaseNotificationEmails } from "@/lib/emails";
import { calculateItemTotal } from "@/lib/calculate-total";
import prisma from "@/lib/prisma";
import { logPaymentEvent } from "@/lib/payment-logger";
import { reconcileOrderDelivery } from "@/lib/order-delivery";

const extractCartIdFromApiRef = (apiRef?: string | null) => {
  if (!apiRef) return null;
  const match = apiRef.match(/^cart_(.+)_\d+$/);
  if (match?.[1]) return match[1];

  if (apiRef.startsWith("cart-")) {
    const parts = apiRef.split("-");
    if (parts.length >= 2) return parts[1];
  }

  return apiRef;
};

export async function POST(req: NextRequest) {
  try {
    const signature =
      req.headers.get("x-intasend-signature") ||
      req.headers.get("x-intasend-hmac-signature") ||
      req.headers.get("intasend-signature");
    const secret =
      process.env.INTASEND_WEBHOOK_SECRET || process.env.INTASEND_SECRET_KEY;
    const expectedChallenge = process.env.INTASEND_WEBHOOK_CHALLENGE;

    if (!secret) {
      console.error("IntaSend webhook secret is not configured.");
      return NextResponse.json(
        { error: "Webhook secret not configured." },
        { status: 500 },
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature." },
        { status: 401 },
      );
    }

    const body = await req.text();

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const calculatedSignature = hmac.digest("hex");

    const provided = Buffer.from(signature);
    const expected = Buffer.from(calculatedSignature);

    if (
      provided.length !== expected.length ||
      !crypto.timingSafeEqual(provided, expected)
    ) {
      return NextResponse.json(
        { error: "Invalid signature." },
        { status: 403 },
      );
    }

    const data = JSON.parse(body);

    if (
      expectedChallenge &&
      data.challenge &&
      data.challenge !== expectedChallenge
    ) {
      return NextResponse.json(
        { error: "Invalid challenge." },
        { status: 403 },
      );
    }

    const state = data.state || data.invoice?.state;
    const apiRef = data.api_ref || data.invoice?.api_ref;
    const paymentId =
      data.invoice_id || data.invoice?.invoice_id || data.invoice?.id;
    const cartId = extractCartIdFromApiRef(apiRef);

    logPaymentEvent("WEBHOOK_RECEIVED", {
      state,
      apiRef,
      paymentId,
    });

    if (state === "COMPLETE") {
      if (!paymentId || !cartId) {
        return NextResponse.json(
          { error: "Invalid webhook payload." },
          { status: 400 },
        );
      }

      const userCart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              design: {
                include: {
                  packageOptions: true,
                },
              },
            },
          },
          discount: true,
          user: true,
        },
      });

      if (!userCart) {
        console.error(
          `Cart not found for api_ref: ${apiRef}, extracted cartId: ${cartId}`,
        );
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }

      // Recalculate USD amount deterministically from the stored cart snapshot.
      const subtotalUSD = userCart.items.reduce((total, item) => {
        const selectedExtras = Array.isArray(item.selectedExtras)
          ? (item.selectedExtras as Array<{ price?: number }>).map((extra) => ({
              price: typeof extra?.price === "number" ? extra.price : 0,
            }))
          : [];

        const itemForCalculation = {
          ...item,
          selectedExtras,
        };
        return total + calculateItemTotal(itemForCalculation);
      }, 0);
      const amountPaidUSD = Math.max(
        0,
        subtotalUSD - (userCart.discountAmount || 0),
      );

      const order = await prisma.$transaction(async (tx) => {
        const existingOrder = await tx.order.findUnique({
          where: { paymentId },
        });

        if (existingOrder) {
          if (apiRef) {
            const attempt = await tx.paymentAttempt.findFirst({
              where: { apiRef },
              orderBy: { createdAt: "desc" },
            });

            if (attempt) {
              await tx.paymentAttempt.update({
                where: { id: attempt.id },
                data: { status: "COMPLETE" },
              });
            }
          }

          return existingOrder;
        }

        const createdOrder = await tx.order.create({
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
            orderId: createdOrder.id,
            designId: item.designId,
            quantity: item.quantity,
            selectedFileTypes: item.selectedFileTypes,
            selectedExtras: item.selectedExtras ?? undefined,
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
            description: `Your order #${createdOrder.id} has been created successfully.`,
            icon: "ShoppingCart",
          },
        });

        if (apiRef) {
          const attempt = await tx.paymentAttempt.findFirst({
            where: { apiRef },
            orderBy: { createdAt: "desc" },
          });

          if (attempt) {
            await tx.paymentAttempt.update({
              where: { id: attempt.id },
              data: { status: "COMPLETE" },
            });
          }
        }

        // Clear cart after successful order creation while preserving cartId in order.
        await tx.paymentAttempt.deleteMany({ where: { cartId: userCart.id } });
        await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
        await tx.cart.delete({ where: { id: userCart.id } });

        return createdOrder;
      });

      logPaymentEvent("WEBHOOK_ORDER_CREATED", {
        orderId: order.id,
        cartId: userCart.id,
        amountUSD: amountPaidUSD,
      });

      const deliveryResult = await reconcileOrderDelivery(order.id);

      if (!deliveryResult.ready) {
        logPaymentEvent("WEBHOOK_MANUAL_DELIVERY_REQUIRED", {
          orderId: order.id,
          missingFiles: deliveryResult.missingFiles,
        });
      }

      // Send email notifications
      await sendPurchaseNotificationEmails(order.id);

      // Send Push Notifications
      try {
        const { getAdminMessaging } = await import("@/lib/firebase-admin");
        const adminMessaging = getAdminMessaging();

        // 1. Notify Admin
        const admin = await prisma.user.findFirst({
          where: { role: "ADMIN" }, // Use string literal if Role enum import is tricky, or import Role
        });

        if (admin) {
          const adminTokens = await prisma.deviceToken.findMany({
            where: { userId: admin.id },
            select: { token: true },
          });

          const tokens = adminTokens.map((t) => t.token);

          if (tokens.length > 0) {
            await adminMessaging.sendEachForMulticast({
              tokens,
              notification: {
                title: "New Order Received",
                body: `Order #${order.id.substring(0, 8)} by ${userCart.user.name || "Customer"}`,
              },
              data: {
                url: `/admin/purchases`,
                orderId: order.id,
              },
            });
          }
        }

        // 2. Notify User
        const userTokens = await prisma.deviceToken.findMany({
          where: { userId: userCart.userId },
          select: { token: true },
        });

        const tokens = userTokens.map((t) => t.token);

        if (tokens.length > 0) {
          await adminMessaging.sendEachForMulticast({
            tokens,
            notification: {
              title: "Order Confirmed",
              body: `Your order #${order.id.substring(0, 8)} has been successfully placed.`,
            },
            data: {
              url: `/dashboard/purchases/${order.id}`,
              orderId: order.id,
            },
          });
        }
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    } else if (state === "FAILED") {
      console.log("Payment failed:", data);

      if (apiRef) {
        const attempt = await prisma.paymentAttempt.findFirst({
          where: { apiRef },
          orderBy: { createdAt: "desc" },
        });

        if (attempt) {
          await prisma.paymentAttempt.update({
            where: { id: attempt.id },
            data: { status: "FAILED" },
          });
        }
      }

      if (!cartId) {
        return NextResponse.json({ success: true });
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

      logPaymentEvent("STK_PUSH_FAILED", {
        apiRef,
        paymentId,
      });
    } else {
      // Ignore transitional states and acknowledge delivery.
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("IntaSend webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
