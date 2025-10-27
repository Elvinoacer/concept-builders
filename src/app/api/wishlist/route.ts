import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wishlist: {
          include: {
            files: true, // Include files to get image URLs
            // Include basePrice of the Design
            // Assuming Design model has a basePrice field
            // If Design is directly the WishlistItem, then basePrice is directly on it.
            // If Wishlist is a join table, then it would be wishlist: { include: { design: { select: { basePrice: true } } } }
            // Based on schema.prisma, User has wishlist: Design[], so Design is directly the item.
          },
          select: {
            id: true,
            name: true,
            basePrice: true, // Include basePrice
            files: true,
          }
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user.wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { designId } = body;

    if (!designId) {
      return new NextResponse("Missing designId", { status: 400 });
    }

    // Remove the design from the user's wishlist
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wishlist: {
          disconnect: {
            id: designId,
          },
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
