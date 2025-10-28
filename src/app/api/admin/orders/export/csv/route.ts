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

    const csvRows = [];
    // Add CSV Header
    csvRows.push("Purchase ID,Client Name,Client Email,Design Name,Quantity,Date,Amount,Status");

    // Add CSV Data
    orders.forEach(order => {
      const clientName = order.user ? order.user.name : 'N/A';
      const clientEmail = order.user ? order.user.email : 'N/A';
      const designNames = order.items.map(item => item.design?.name || 'N/A').join('; ');
      const quantities = order.items.map(item => item.quantity).join('; ');
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      const amount = `$${order.amount.toFixed(2)}`;
      const orderStatus = order.status;

      csvRows.push(
        `"${order.id}","${clientName}","${clientEmail}","${designNames}","${quantities}","${orderDate}","${amount}","${orderStatus}"`
      );
    });

    const csvString = csvRows.join('\n');

    return new NextResponse(csvString, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="purchases.csv"',
      },
    });
  } catch (error) {
    console.error("Error exporting purchases to CSV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
