import { OrderStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      items,
      amount,
      paymentGateway,
      paymentId,
      discountCode,
      discountAmount,
      discountId,
    } = await req.json();

    if (
      !items ||
      items.length === 0 ||
      amount === undefined ||
      !paymentGateway ||
      !paymentId
    ) {
      return NextResponse.json(
        { message: "Missing required order details" },
        { status: 400 }
      );
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount),
        paymentGateway,
        paymentId,
        status: OrderStatus.PAID, // Assuming payment is successful at this point
        discountCode: discountCode || null,
        discountAmount: discountAmount || null,
        discountId: discountId || null,
        items: {
          create: items.map((item: any) => ({
            designId: item.designId,
            quantity: item.quantity,
          })),
        },
      },
    });

    // If a discount was applied, increment its usage count
    if (discountId) {
      await prisma.discount.update({
        where: { id: discountId },
        data: {
          uses: {
            increment: 1,
          },
        },
      });
    }

    // TODO: Clear user's cart after successful order

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
