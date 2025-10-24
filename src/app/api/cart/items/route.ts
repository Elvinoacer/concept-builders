import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    // No session means no database cart. Return an empty array.
    return NextResponse.json([], { status: 200 });
  }

  try {
    const userCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            design: true, // Include the full design details in the cart item
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        discount: true, // Include discount details
      },
    });

    if (!userCart) {
      // Return an empty cart object with null discount details if no cart exists
      return NextResponse.json(
        {
          id: null, // Or a default ID if needed by frontend
          userId: session.user.id,
          items: [],
          discountCode: null,
          discountAmount: null,
          discountId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json(userCart);
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { designId, selectedPackage, selectedExtras } = await req.json();
    const selectedExtrasString = JSON.stringify(selectedExtras);
    if (!designId) {
      return NextResponse.json(
        { error: "Design ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Find or create a cart for the user
    const userCart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Add the new item to the cart, or do nothing if it exists
    console.log("Upserting cart item with data:", {
      where: {
        cartId_designId: {
          cartId: userCart.id,
          designId: designId,
        },
      },
      update: { selectedPackage, selectedExtras },
      create: {
        cartId: userCart.id,
        designId: designId,
        quantity: 1,
        selectedPackage,
        selectedExtras,
      },
    });

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        designId: designId,
        selectedPackage: selectedPackage,
        selectedExtras: selectedExtrasString,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          designId: designId,
          quantity: 1,
          selectedPackage,
          selectedExtras: selectedExtrasString,
        },
      });
    }

    // Fetch the updated cart to return to the client
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            design: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        discount: true, // Include discount details
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
