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
    const monthParam = searchParams.get("month");
    const timePeriod = searchParams.get("timePeriod") || "Last 6 Months";

    let whereClause: any = {};

    if (monthParam) {
      // If a specific month is requested, filter for that month
      const targetMonth = new Date(monthParam);
      const nextMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);
      whereClause = {
        month: {
          gte: targetMonth,
          lt: nextMonth,
        },
      };
    } else {
      // Otherwise, use the timePeriod logic for historical data
      let startDate: Date;
      const now = new Date();

      if (timePeriod === "Last 6 Months") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6 months ago, first day
      } else if (timePeriod === "Last 12 Months") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months ago, first day
      } else if (timePeriod === "All Time") {
        startDate = new Date(0); // Epoch start
      } else {
        // Default to Last 6 Months
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      }
      whereClause = {
        month: {
          gte: startDate,
        },
      };
    }

    const historicalCosts = await prisma.monthlyCost.findMany({
      where: whereClause,
      orderBy: {
        month: "asc",
      },
    });

    return NextResponse.json(historicalCosts);
  } catch (error) {
    console.error("Error fetching historical costs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
