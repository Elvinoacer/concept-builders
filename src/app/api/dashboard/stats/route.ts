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
    const purchasedPlans = await prisma.order.count({
      where: {
        userId,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wishlist: true,
      },
    });

    const wishlistedItems = user?.wishlist.length || 0;

    const stats = [
      {
        name: "Purchased Plans",
        value: purchasedPlans.toString(),
        icon: "shopping_bag",
      },
      {
        name: "Wishlisted Items",
        value: wishlistedItems.toString(),
        icon: "favorite",
      },
    ];

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
