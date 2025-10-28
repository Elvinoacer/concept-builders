import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const searchTerm = searchParams.get("searchTerm") || "";
    const status = searchParams.get("status") || "All";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let where: any = {};

    // Search Term Filter
    if (searchTerm) {
      where.OR = [
        {
          id: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Status Filter
    if (status !== "All") {
      if (status === "Refunds") {
        where.status = {
          in: ["REFUND_REQUESTED", "REFUNDED"],
        };
      } else {
        where.status = status.toUpperCase();
      }
    }

    // Date Range Filter
    if (startDateParam && endDateParam) {
      where.createdAt = {
        gte: new Date(startDateParam),
        lte: new Date(endDateParam),
      };
    }

    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            design: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalOrders = await prisma.order.count({ where });

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
