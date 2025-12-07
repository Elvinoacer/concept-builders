import { client } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";
import { DiscountType } from "@/generated/prisma";
import { sendPurchaseNotificationEmails } from "@/lib/emails";

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
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
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
      return NextResponse.json({ error: "Cart is empty or no longer exists" }, { status: 400 });
    }

    // Calculate total amount from cart items
    let calculatedTotal = userCart.items.reduce((total, item) => {
      const itemForCalculation = {
        ...item,
        selectedExtras: item.selectedExtras as any[],
      };
      return total + calculateItemTotal(itemForCalculation);
    }, 0);

    let appliedDiscountAmount = 0;
    let appliedDiscountId = null;

    // Handle Discount
    if (discountCode) {
      const discount = await prisma.discount.findUnique({
        where: { code: discountCode },
      });

      if (discount) {
        // Validate Discount
        let isValid = true;
        let errorMessage = "";

        if (!discount.isActive) {
          isValid = false;
          errorMessage = "Discount is not active";
        } else if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
          isValid = false;
          errorMessage = "Discount has expired";
        } else if (discount.maxUses && discount.uses >= discount.maxUses) {
          isValid = false;
          errorMessage = "Discount has reached its maximum uses";
        } else if (discount.minPurchaseAmount && calculatedTotal < discount.minPurchaseAmount) {
          isValid = false;
          errorMessage = `Minimum purchase of ${discount.minPurchaseAmount.toFixed(2)} required`;
        }

        if (isValid) {
           const existingOrderWithDiscount = await prisma.order.findFirst({
            where: {
              userId: userId,
              discountId: discount.id,
              status: {
                in: ['PAID', 'REFUND_REQUESTED'],
              },
            },
          });

          if (existingOrderWithDiscount) {
             isValid = false;
             errorMessage = "You have already used this discount code";
          }
        }

        if (isValid) {
          if (discount.type === DiscountType.PERCENTAGE) {
            appliedDiscountAmount = calculatedTotal * (discount.value / 100);
          } else if (discount.type === DiscountType.FIXED_AMOUNT) {
            appliedDiscountAmount = discount.value;
          }

          // Cap discount at total
          appliedDiscountAmount = Math.min(appliedDiscountAmount, calculatedTotal);
          
          calculatedTotal -= appliedDiscountAmount;
          appliedDiscountId = discount.id;

        } else {
             console.warn(`Invalid discount code provided: ${discountCode} - ${errorMessage}`);
             return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
      } else {
          return NextResponse.json({ error: "Invalid discount code" }, { status: 404 });
      }
    }

    // Capture Payment
    const PaypalClient = client();
    const req = new paypal.orders.OrdersCaptureRequest(orderID);
    req.requestBody({});

    console.log("Attempting to capture PayPal order:", orderID);

    const response = await PaypalClient.execute(req);

    if (response.statusCode !== 201) {
      console.error("PayPal Capture Failed Response:", JSON.stringify(response.result, null, 2));
      
      let errorMsg = `PayPal capture failed with status: ${response.statusCode}`;
      
      // Extract specific error details
      if (response.result && response.result.details && response.result.details.length > 0) {
        const issue = response.result.details[0].issue;
        const description = response.result.details[0].description;
        
        switch (issue) {
          case 'INSTRUMENT_DECLINED':
            errorMsg = "Your payment method was declined. Please try a different card or bank account.";
            break;
          case 'TRANSACTION_REFUSED':
            errorMsg = "The transaction was refused by PayPal. Please contact PayPal support or try again.";
            break;
          case 'PAYER_ACTION_REQUIRED':
            errorMsg = "Additional action is required to complete the payment. Please try again.";
            break;
          case 'DUPLICATE_INVOICE_ID':
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
        { status: 400 }
      );
    }

    // Verify Amount
    const capturedAmount = parseFloat(capture.amount.value);
    if (Math.abs(capturedAmount - calculatedTotal) > 0.01) {
      console.error("Amount mismatch:", {
        captured: capturedAmount,
        expected: calculatedTotal,
      });
      return NextResponse.json(
        { error: "Payment amount mismatch detected" },
        { status: 400 }
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
          discountAmount: appliedDiscountAmount > 0 ? appliedDiscountAmount : null,
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
          selectedExtras: item.selectedExtras as any,
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

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      redirect_url: `/purchase-confirmation?purchaseId=${newOrder.id}`,
    });

  } catch (error: any) {
    console.error("PayPal Capture Error:", error);
    
    // Handle SDK errors that might throw exceptions
    let errorMessage = "Internal server error during payment processing";
    if (error.message) {
        if (error.message.includes("INSTRUMENT_DECLINED")) {
            errorMessage = "Your payment method was declined. Please try a different card.";
        } else if (error.message.includes("insufficient funds")) {
            errorMessage = "Insufficient funds in your account.";
        }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
