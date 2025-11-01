import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    // No session means no database cart. Return an empty cart object.
    return NextResponse.json(
      {
        id: null,
        userId: null,
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

  try {
            design: {
              include: {
                images: true,
                packageOptions: true,
              },
              select: {
                id: true,
                name: true,
                basePrice: true,
                architecturalPdfPrice: true,
                architecturalCadPrice: true,
                structuralPdfPrice: true,
                structuralCadPrice: true,
                billOfQuantitiesPrice: true,
              }
            }
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
    const { designId, selectedFileTypes, selectedPackages, selectedExtras } = await req.json();
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

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        designId: designId,
        selectedFileTypes: {
          equals: selectedFileTypes,
        },
        selectedPackage: {
          equals: selectedPackages,
        },
        selectedExtras: {
          equals: selectedExtras,
        },
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + 1,
          selectedFileTypes: selectedFileTypes,
          selectedPackage: selectedPackages,
          selectedExtras: selectedExtras,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          designId: designId,
          quantity: 1,
          selectedFileTypes: selectedFileTypes,
          selectedPackage: selectedPackages,
          selectedExtras: selectedExtras,
        },
      });
    }

    // Fetch the updated cart to return to the client
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            design: {
              include: {
                images: true,
                packageOptions: true,
              },
              select: {
                id: true,
                name: true,
                basePrice: true,
                architecturalPdfPrice: true,
                architecturalCadPrice: true,
                structuralPdfPrice: true,
                structuralCadPrice: true,
                billOfQuantitiesPrice: true,
              }
            }
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
