import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET() {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Go back 5 months to include the current month as one of the six
    sixMonthsAgo.setDate(1); // Start from the first day of that month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        status: "PAID",
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    // Initialize sales data for the last six months
    const monthlySalesMap = new Map<string, { month: string; sales: number }>();
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const key = `${monthName} ${year}`;
      monthlySalesMap.set(key, { month: monthName, sales: 0 });
    }

    // Aggregate sales
    orders.forEach((order) => {
      const monthName = order.createdAt.toLocaleString("default", {
        month: "short",
      });
      const year = order.createdAt.getFullYear();
      const key = `${monthName} ${year}`;
      if (monthlySalesMap.has(key)) {
        const current = monthlySalesMap.get(key)!;
        current.sales += order.amount;
        monthlySalesMap.set(key, current);
      }
    });

    // Convert map to array and reverse to get chronological order
    const monthlySales = Array.from(monthlySalesMap.values()).reverse();

    return NextResponse.json(monthlySales);
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
