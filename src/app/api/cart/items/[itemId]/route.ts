import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId: designId } = params;
  if (!designId) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const userId = session.user.id;

    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (userCart) {
      // Delete the item from the cart
      await prisma.cartItem.deleteMany({
        where: {
          cartId: userCart.id,
          designId: designId,
        },
      });
    }

    // Fetch the updated cart to return to the client
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            design: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const frontendCartItems = updatedCart?.items.map((item) => ({
      ...item.design,
      quantity: item.quantity,
    })) || [];

    return NextResponse.json(frontendCartItems);

  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}