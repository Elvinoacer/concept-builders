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

  const { itemId } = params;
  if (!itemId) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const userId = session.user.id;

    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (userCart) {
      // Delete the item from the cart
      await prisma.cartItem.delete({
        where: {
          id: itemId,
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
      cartItemId: item.id,
      quantity: item.quantity,
      selectedFileType: item.selectedFileType,
      selectedPackage: item.selectedPackage,
      selectedExtras: item.selectedExtras,
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

export async function PUT(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId } = params;
  if (!itemId) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const userId = session.user.id;
    const body = await req.json();
    const { quantity, selectedFileType, selectedPackage, selectedExtras } = body;

    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cartId: userCart.id,
        }
    });

    if (!cartItem) {
        return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
        selectedFileType,
        selectedPackage,
        selectedExtras,
      },
    });

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
      cartItemId: item.id,
      quantity: item.quantity,
      selectedFileType: item.selectedFileType,
      selectedPackage: item.selectedPackage,
      selectedExtras: item.selectedExtras,
    })) || [];

    return NextResponse.json(frontendCartItems);

  } catch (error) {
    console.error("Failed to update item in cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}