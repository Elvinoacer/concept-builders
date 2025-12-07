import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId } = await params;
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
            design: {
              include: {
                images: true,
                packageOptions: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedCart);
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
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId } = await params;
  if (!itemId) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const userId = session.user.id;
    const { quantity, selectedFileTypes, selectedPackages, selectedExtras } = await req.json();

    const updateData: any = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (selectedFileTypes !== undefined) updateData.selectedFileTypes = selectedFileTypes;
    if (selectedPackages !== undefined) updateData.selectedPackage = selectedPackages;
    if (selectedExtras !== undefined) updateData.selectedExtras = selectedExtras;


    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: updateData,
    });

    // Fetch the updated cart to return to the client
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            design: {
              include: {
                images: true,
                packageOptions: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Failed to update item in cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
