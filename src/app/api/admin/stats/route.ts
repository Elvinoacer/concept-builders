import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET() {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const currentEndDate = new Date();
    const currentStartDate = new Date(currentEndDate);
    currentStartDate.setDate(currentEndDate.getDate() - 30);

    const previousEndDate = new Date(currentStartDate);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousEndDate.getDate() - 30);

    // --- Current Period Metrics (Last 30 days) ---
    const currentPeriodSalesAggregate = await prisma.order.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        createdAt: {
          gte: currentStartDate,
          lt: currentEndDate,
        },
      },
    });
    const currentPeriodSales = currentPeriodSalesAggregate._sum.amount || 0;

    const currentPeriodVisitors = await prisma.referralVisit.count({
      where: {
        createdAt: {
          gte: currentStartDate,
          lt: currentEndDate,
        },
      },
    });

    const currentPeriodOrders = await prisma.order.count({
      where: {
        status: "PAID",
        createdAt: {
          gte: currentStartDate,
          lt: currentEndDate,
        },
      },
    });

    // --- Previous Period Metrics (30-60 days ago) ---
    const previousPeriodSalesAggregate = await prisma.order.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
    });
    const previousPeriodSales = previousPeriodSalesAggregate._sum.amount || 0;

    const previousPeriodVisitors = await prisma.referralVisit.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
    });

    const previousPeriodOrders = await prisma.order.count({
      where: {
        status: "PAID",
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
    });

    // --- Calculate Percentage Changes ---
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0; // If previous was 0 and current is > 0, it's 100% growth. If both are 0, 0% change.
      }
      return ((current - previous) / previous) * 100;
    };

    const salesChange = calculatePercentageChange(
      currentPeriodSales,
      previousPeriodSales,
    );
    const visitorsChange = calculatePercentageChange(
      currentPeriodVisitors,
      previousPeriodVisitors,
    );
    const ordersChange = calculatePercentageChange(
      currentPeriodOrders,
      previousPeriodOrders,
    );

    const stats = {
      totalSales: currentPeriodSales,
      salesChange,
      totalVisitors: currentPeriodVisitors,
      visitorsChange,
      totalOrders: currentPeriodOrders,
      ordersChange,
      conversionRate:
        currentPeriodVisitors > 0
          ? (currentPeriodOrders / currentPeriodVisitors) * 100
          : 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
