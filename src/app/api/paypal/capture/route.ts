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
  const { orderID } = body;

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
      return NextResponse.json(
        { error: "Failed to capture payment." },
        { status: 500 }
      );
    }

    // Payment was successful, now create the order in the database.
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { design: true } } },
    });

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = userCart.items.reduce(
      (acc, item) => acc + item.design.basePrice * item.quantity,
      0
    );

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId,
          amount: totalAmount,
          status: "PAID",
          paymentGateway: "PAYPAL",
          paymentId: response.result.id,
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

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}