import { client } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";
import { sendPurchaseNotificationEmails } from "@/lib/emails";
import { validateAndApplyDiscount } from "@/lib/validate-discount";
import { logPaymentEvent } from "@/lib/payment-logger";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { orderID, discountCode } = body;

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    // Fetch user cart
    const userCart = await prisma.cart.findUnique({
      where: { userId },
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
        user: true,
      },
    });

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or no longer exists" },
        { status: 400 },
      );
    }

    // Calculate total amount from cart items
    let calculatedTotal = userCart.items.reduce((total, item) => {
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

    let appliedDiscountAmount = 0;
    let appliedDiscountId: string | null = null;

    if (discountCode) {
      const discountResult = await validateAndApplyDiscount(
        discountCode,
        calculatedTotal,
        userId,
      );

      if (!discountResult.valid) {
        return NextResponse.json(
          { error: discountResult.error },
          { status: 400 },
        );
      }

      appliedDiscountAmount = discountResult.appliedAmount;
      appliedDiscountId = discountResult.discount.id;
      calculatedTotal = discountResult.finalTotal;
    }

    // Capture Payment
    const PaypalClient = client();
    const req = new paypal.orders.OrdersCaptureRequest(orderID);

    console.log("Attempting to capture PayPal order:", orderID);

    const response = await PaypalClient.execute(req);

    if (response.statusCode !== 201) {
      console.error(
        "PayPal Capture Failed Response:",
        JSON.stringify(response.result, null, 2),
      );

      let errorMsg = `PayPal capture failed with status: ${response.statusCode}`;

      // Extract specific error details
      if (
        response.result &&
        response.result.details &&
        response.result.details.length > 0
      ) {
        const issue = response.result.details[0].issue;
        const description = response.result.details[0].description;

        switch (issue) {
          case "INSTRUMENT_DECLINED":
            errorMsg =
              "Your payment method was declined. Please try a different card or bank account.";
            break;
          case "TRANSACTION_REFUSED":
            errorMsg =
              "The transaction was refused by PayPal. Please contact PayPal support or try again.";
            break;
          case "PAYER_ACTION_REQUIRED":
            errorMsg =
              "Additional action is required to complete the payment. Please try again.";
            break;
          case "DUPLICATE_INVOICE_ID":
            errorMsg = "This order has already been paid.";
            break;
          default:
            errorMsg = description || `Payment failed: ${issue}`;
        }
      }

      await prisma.notification.create({
        data: {
          userId: userId,
          title: "Payment Capture Failed",
          description: `Failed to capture payment for order ${orderID}. ${errorMsg}`,
          icon: "AlertTriangle",
        },
      });

      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const capture = response.result.purchase_units[0].payments.captures[0];

    if (capture.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${capture.status}` },
        { status: 400 },
      );
    }

    // Verify Amount
    const capturedAmount = parseFloat(
      parseFloat(capture.amount.value).toFixed(2),
    );
    const expectedAmount = parseFloat(calculatedTotal.toFixed(2));
    if (Math.abs(capturedAmount - expectedAmount) > 0.01) {
      console.error("Amount mismatch:", {
        captured: capturedAmount,
        expected: expectedAmount,
      });
      return NextResponse.json(
        { error: "Payment amount mismatch detected" },
        { status: 400 },
      );
    }

    // Create Order
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId,
          amount: calculatedTotal,
          status: "PAID",
          paymentGateway: "PAYPAL",
          paymentId: capture.id,
          discountCode: discountCode || null,
          discountAmount:
            appliedDiscountAmount > 0 ? appliedDiscountAmount : null,
          discountId: appliedDiscountId,
          cartId: userCart.id, // Store cartId for reference
        },
      });

      await tx.orderItem.createMany({
        data: userCart.items.map((item) => ({
          orderId: order.id,
          designId: item.designId,
          quantity: item.quantity,
          selectedFileTypes: item.selectedFileTypes,
          selectedExtras: item.selectedExtras ?? undefined,
        })),
      });

      if (appliedDiscountId) {
        await tx.discount.update({
          where: { id: appliedDiscountId },
          data: {
            uses: {
              increment: 1,
            },
          },
        });
      }

      await tx.cart.delete({ where: { id: userCart.id } });

      await tx.notification.create({
        data: {
          userId: userId,
          title: "Order Created Successfully",
          description: `Your order #${order.id} has been confirmed and payment received.`,
          icon: "ShoppingCart",
        },
      });

      return order;
    });

    // Send notification emails (User & Admin)
    // We do this outside the transaction to avoid blocking it if email service is slow
    // and to ensure we only send email if transaction committed successfully
    await sendPurchaseNotificationEmails(newOrder.id);

    // Send Push Notifications
    try {
      const { getAdminMessaging } = await import("@/lib/firebase-admin");
      const adminMessaging = getAdminMessaging();

      // 1. Notify Admin
      const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
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
              body: `Order #${newOrder.id.substring(0, 8)} by ${userCart.user.name || "Customer"}`,
            },
            data: {
              url: `/admin/purchases`,
              orderId: newOrder.id,
            },
          });
        }
      }

      // 2. Notify User
      const userTokens = await prisma.deviceToken.findMany({
        where: { userId: userId },
        select: { token: true },
      });

      const tokens = userTokens.map((t) => t.token);

      if (tokens.length > 0) {
        await adminMessaging.sendEachForMulticast({
          tokens,
          notification: {
            title: "Order Confirmed",
            body: `Your order #${newOrder.id.substring(0, 8)} has been successfully placed.`,
          },
          data: {
            url: `/dashboard/purchases/${newOrder.id}`,
            orderId: newOrder.id,
          },
        });
      }
    } catch (pushError) {
      console.error("Failed to send push notification:", pushError);
    }

    logPaymentEvent("PAYPAL_CAPTURE_SUCCESS", {
      userId,
      orderId: newOrder.id,
      capturedAmount,
      expectedAmount,
      paypalOrderId: orderID,
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      redirect_url: `/purchase-confirmation?purchaseId=${newOrder.id}`,
    });
  } catch (error: unknown) {
    console.error("PayPal Capture Error:", error);
    logPaymentEvent("PAYPAL_CAPTURE_FAILED", {
      userId,
      error: error instanceof Error ? error.message : "unknown",
    });

    // Handle SDK errors that might throw exceptions
    let errorMessage = "Internal server error during payment processing";
    if (error instanceof Error && error.message) {
      if (error.message.includes("INSTRUMENT_DECLINED")) {
        errorMessage =
          "Your payment method was declined. Please try a different card.";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds in your account.";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
