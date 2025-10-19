
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Design } from "@/lib/dummydata";

interface CartItemWithQuantity extends Design {
  quantity: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const localCartItems: CartItemWithQuantity[] = await req.json();

  if (!localCartItems || localCartItems.length === 0) {
    return NextResponse.json({ message: "No items to sync." }, { status: 200 });
  }

  try {
    // Find or create a cart for the user
    let userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Use a transaction to upsert all items
    const upsertOperations = localCartItems.map((item) =>
      prisma.cartItem.upsert({
        where: {
          cartId_designId: {
            cartId: userCart!.id,
            designId: item.id,
          },
        },
        update: {
          // If the item already exists, do nothing. The quantity is always 1.
        },
        create: {
          cartId: userCart!.id,
          designId: item.id,
          quantity: item.quantity,
        },
      })
    );

    await prisma.$transaction(upsertOperations);

    return NextResponse.json({ message: "Cart synced successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
