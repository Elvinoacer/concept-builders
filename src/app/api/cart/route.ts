import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { designId, quantity = 1, selectedFileType, selectedPackage, selectedExtras } = body;

    if (!designId) {
      return new NextResponse("Missing designId", { status: 400 });
    }

    let userCart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    // Check if the item already exists in the cart with the same options
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        designId: designId,
        selectedFileType: selectedFileType,
        selectedPackage: selectedPackage,
        selectedExtras: selectedExtras,
      },
    });

    if (existingCartItem) {
      // If it exists, update the quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
      return NextResponse.json(updatedCartItem);
    } else {
      // Otherwise, create a new cart item
      const newCartItem = await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          designId: designId,
          quantity: quantity,
          selectedFileType: selectedFileType,
          selectedPackage: selectedPackage,
          selectedExtras: selectedExtras,
        },
      });
      return NextResponse.json(newCartItem);
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}