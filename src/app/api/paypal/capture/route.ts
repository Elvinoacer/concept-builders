import { client } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const body = await request.json();
  const { orderID, discountCode, discountAmount, discountId, cart } = body;

  if (!orderID) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  // Validate cart data
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json(
      { error: "Cart data is invalid or empty" },
      { status: 400 }
    );
  }

  try {
    const PaypalClient = client();
    const req = new paypal.orders.OrdersCaptureRequest(orderID);
    req.requestBody({});

    console.log("Attempting to capture PayPal order:", orderID);

    const response = await PaypalClient.execute(req);
    console.log("PayPal Capture Response:", {
      status: response.statusCode,
      result: response.result,
    });

    if (response.statusCode !== 201) {
      const errorMsg = `PayPal capture failed with status: ${response.statusCode}`;
      console.error(errorMsg, response.result);

      await prisma.notification.create({
        data: {
          userId: userId,
          title: "Payment Capture Failed",
          description: `Failed to capture payment for order ${orderID}. Status: ${response.statusCode}`,
          icon: "AlertTriangle",
        },
      });

      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const capture = response.result.purchase_units[0].payments.captures[0];
    console.log("Payment Capture Details:", {
      captureId: capture.id,
      status: capture.status,
      amount: capture.amount?.value,
    });

    // Verify payment was actually completed
    if (capture.status !== "COMPLETED") {
      console.error("Payment not completed:", capture.status);

      await prisma.notification.create({
        data: {
          userId: userId,
          title: "Payment Not Completed",
          description: `Payment for order ${orderID} was not completed. Status: ${capture.status}`,
          icon: "AlertTriangle",
        },
      });

      return NextResponse.json(
        { error: `Payment not completed. Status: ${capture.status}` },
        { status: 400 }
      );
    }

    // Check if order already exists (prevent duplicates)
    const existingOrder = await prisma.order.findUnique({
      where: { paymentId: capture.id },
    });

    if (existingOrder) {
      console.log("Order already exists:", existingOrder.id);
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        redirect_url: `/purchase-confirmation?purchaseId=${existingOrder.id}`,
      });
    }

    // Verify user cart still exists and has items
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { design: true } } },
    });

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or no longer exists" },
        { status: 400 }
      );
    }

    // Calculate total amount from cart
    const totalAmount = userCart.items.reduce((acc, item) => {
      let itemTotal = item.design.basePrice * item.quantity;
      if (item.selectedExtras) {
        let extras;
        if (typeof item.selectedExtras === "string") {
          try {
            extras = JSON.parse(item.selectedExtras);
          } catch (error) {
            console.error("Error parsing selectedExtras:", error);
            extras = [];
          }
        } else {
          extras = item.selectedExtras;
        }
        extras.forEach((extra: any) => {
          itemTotal += extra.price || 0;
        });
      }
      return acc + itemTotal;
    }, 0);

    // Apply discount if exists
    const finalAmount = discountAmount
      ? totalAmount - discountAmount
      : totalAmount;

    // Verify the captured amount matches our expected amount
    const capturedAmount = parseFloat(capture.amount.value);
    if (Math.abs(capturedAmount - finalAmount) > 0.01) {
      console.error("Amount mismatch:", {
        captured: capturedAmount,
        expected: finalAmount,
      });

      await prisma.notification.create({
        data: {
          userId: userId,
          title: "Payment Amount Mismatch",
          description: `Captured amount (${capturedAmount}) does not match expected amount (${finalAmount})`,
          icon: "AlertTriangle",
        },
      });

      return NextResponse.json(
        { error: "Payment amount mismatch detected" },
        { status: 400 }
      );
    }

    // Create order in database - only after successful payment verification
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId,
          amount: finalAmount,
          status: "PAID",
          paymentGateway: "PAYPAL",
          paymentId: capture.id,
          discountCode: discountCode || null,
          discountAmount: discountAmount || null,
          discountId: discountId || null,
          paypalOrderId: orderID,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: userCart.items.map((item) => {
          let selectedExtras = item.selectedExtras;
          if (typeof selectedExtras === "string") {
            try {
              selectedExtras = JSON.parse(selectedExtras);
            } catch (error) {
              console.error("Error parsing selectedExtras:", error);
              selectedExtras = null;
            }
          }
          return {
            orderId: order.id,
            designId: item.designId,
            quantity: item.quantity,
            selectedFileTypes: item.selectedFileTypes,
            selectedExtras: selectedExtras,
            unitPrice: item.design.basePrice,
          };
        }),
      });

      // Update discount usage if applicable
      if (discountId) {
        await tx.discount.update({
          where: { id: discountId },
          data: {
            uses: {
              increment: 1,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
      await tx.cart.delete({ where: { id: userCart.id } });

      // Create success notification
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

    console.log("Order created successfully:", newOrder.id);

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      redirect_url: `/purchase-confirmation?purchaseId=${newOrder.id}`,
    });
  } catch (error: any) {
    console.error("PayPal Capture Transaction Error:", {
      message: error.message,
      stack: error.stack,
      orderID: orderID,
      userId: userId,
    });

    // Create error notification
    await prisma.notification.create({
      data: {
        userId: userId,
        title: "Payment Processing Failed",
        description: `Failed to process payment for order ${orderID}. Please contact support.`,
        icon: "AlertTriangle",
      },
    });

    let errorMessage = "Internal server error during payment processing";
    if (error.message?.includes("insufficient")) {
      errorMessage = "Insufficient funds in your account";
    } else if (error.message?.includes("card")) {
      errorMessage = "Card declined. Please check your card details.";
    } else if (error.message?.includes("currency")) {
      errorMessage = "Currency not supported for this payment method";
    }

    return NextResponse.json(
      { error: `${errorMessage}: ${error.message}` },
      { status: 500 }
    );
  }
}
