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
          },
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
