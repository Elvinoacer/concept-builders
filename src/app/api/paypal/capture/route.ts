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
  const { orderID, discountCode, discountAmount, discountId } = body;

  if (!orderID) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const PaypalClient = client();
    const req = new paypal.orders.OrdersCaptureRequest(orderID);
    req.requestBody({});

    const response = await PaypalClient.execute(req);

    if (response.result.status !== "COMPLETED") {
      await prisma.notification.create({
        data: {
          userId: userId,
          title: "Payment Failed",
          description: `Your payment for order ${orderID} failed.`,
          icon: "AlertTriangle",
        },
      });
      return NextResponse.json(
        { error: "Failed to capture payment." },
        { status: 500 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { paymentId: response.result.id },
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
      });
    }

    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { design: true } } },
    });

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = userCart.items.reduce((acc, item) => {
      let itemTotal = item.design.basePrice * item.quantity;
      if (item.selectedFileType === 'pdf') {
        itemTotal += item.design.pdfPrice || 0;
      } else if (item.selectedFileType === 'cad') {
        itemTotal += item.design.cadPrice || 0;
      } else if (item.selectedFileType === 'pdf-and-cad') {
        itemTotal += item.design.pdfAndCadPrice || 0;
      }
      if (item.selectedExtras) {
        let extras;
        if (typeof item.selectedExtras === 'string') {
          extras = JSON.parse(item.selectedExtras);
        } else {
          extras = item.selectedExtras;
        }
        extras.forEach((extra: any) => {
          itemTotal += extra.price;
        });
      }
      return acc + itemTotal;
    }, 0);

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId,
          amount: totalAmount,
          status: "PAID",
          paymentGateway: "PAYPAL",
          paymentId: response.result.id,
          discountCode: discountCode || null,
          discountAmount: discountAmount || null,
          discountId: discountId || null,
        },
      });

      await tx.orderItem.createMany({
        data: userCart.items.map((item) => ({
          orderId: order.id,
          designId: item.designId,
          quantity: item.quantity,
          selectedFileType: item.selectedFileType,
          selectedPackage: item.selectedPackage,
          selectedExtras: item.selectedExtras,
        })),
      });

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

      await tx.notification.create({
        data: {
          userId: userId,
          title: "Order Created",
          description: `Your order #${order.id} has been created successfully.`,
          icon: "ShoppingCart",
        },
      });

      await tx.cart.delete({ where: { id: userCart.id } });

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      redirect_url: `/purchase-confirmation?purchaseId=${newOrder.id}`,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}