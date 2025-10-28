import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

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

    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Purchase ID', 'Client', 'Design Name', 'Quantity', 'Date', 'Amount', 'Status']],
      body: orders.map(order => [
        order.id,
        order.user ? order.user.name : 'N/A',
        order.items.map(item => item.design?.name || 'N/A').join(', '),
        order.items.map(item => item.quantity).join(', '),
        new Date(order.createdAt).toLocaleDateString(),
        `$${order.amount.toFixed(2)}`,
        order.status,
      ]),
    });

    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="purchases.pdf"',
      },
    });
  } catch (error) {
    console.error("Error exporting purchases to PDF:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
