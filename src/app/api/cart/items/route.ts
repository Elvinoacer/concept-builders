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
      },
    });

    if (!userCart) {
      return NextResponse.json([], { status: 200 });
    }

    // Transform the data to match the structure the frontend expects (Design with quantity)
    const frontendCartItems = userCart.items.map((item) => ({
      ...item.design,
      quantity: item.quantity,
    }));

    return NextResponse.json(frontendCartItems);
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
    const { designId } = await req.json();
    if (!designId) {
      return NextResponse.json({ error: "Design ID is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Find or create a cart for the user
    const userCart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Add the new item to the cart, or do nothing if it exists
    await prisma.cartItem.upsert({
      where: {
        cartId_designId: {
          cartId: userCart.id,
          designId: designId,
        },
      },
      update: {},
      create: {
        cartId: userCart.id,
        designId: designId,
        quantity: 1,
      },
    });

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
      },
    });

    const frontendCartItems = updatedCart?.items.map((item) => ({
      ...item.design,
      quantity: item.quantity,
    })) || [];

    return NextResponse.json(frontendCartItems);

  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
