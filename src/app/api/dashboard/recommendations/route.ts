import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Find all orders for the current user
    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            design: true,
          },
        },
      },
    });

    if (userOrders.length === 0) {
      // If the user has no orders, return the top 4 best-selling designs
      const bestSellingDesigns = await prisma.design.findMany({
        orderBy: {
          orderItems: {
            _count: "desc",
          },
        },
        take: 4,
        include: {
          files: true,
          category: true,
        },
      });
      return NextResponse.json(bestSellingDesigns);
    }

    // Find the most purchased design category
    const designCounts = new Map<string, number>();
    userOrders.forEach(order => {
      order.items.forEach(item => {
        const categoryId = item.design.categoryId;
        if (categoryId) {
          designCounts.set(categoryId, (designCounts.get(categoryId) || 0) + 1);
        }
      });
    });

    if (designCounts.size === 0) {
        // If no designs with categories, return top 4 best-selling
        const bestSellingDesigns = await prisma.design.findMany({
            orderBy: {
                orderItems: {
                    _count: "desc",
                },
            },
            take: 4,
            include: {
                files: true,
                category: true,
            },
        });
        return NextResponse.json(bestSellingDesigns);
    }

    const mostPurchasedCategoryId = [...designCounts.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];

    // Get the IDs of all designs the user has purchased
    const purchasedDesignIds = userOrders.flatMap(order => order.items.map(item => item.designId));

    // Find the top 4 best-selling designs from the most purchased category, excluding already purchased designs
    const recommendedDesigns = await prisma.design.findMany({
      where: {
        categoryId: mostPurchasedCategoryId,
        id: {
          notIn: purchasedDesignIds,
        },
      },
      orderBy: {
        orderItems: {
          _count: "desc",
        },
      },
      take: 4,
      include: {
        files: true,
        category: true,
      },
    });

    return NextResponse.json(recommendedDesigns);
  } catch (error) {
    console.error("Error fetching recommended designs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
