import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const timePeriod = searchParams.get("timePeriod") || "Last 30 Days";

    let currentPeriodWhereClause = {};
    let previousPeriodWhereClause = {};

    const now = new Date();
    let currentStartDate: Date;
    let currentEndDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    if (timePeriod === "Today") {
      currentStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      currentEndDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      previousStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );
      previousEndDate = currentStartDate;
    } else if (timePeriod === "Last 7 Days") {
      currentEndDate = now;
      currentStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );
      previousEndDate = currentStartDate;
      previousStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 14,
      );
    } else if (timePeriod === "Last 30 Days") {
      currentEndDate = now;
      currentStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30,
      );
      previousEndDate = currentStartDate;
      previousStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 60,
      );
    } else if (timePeriod === "All Time") {
      currentStartDate = new Date(0); // Epoch start
      currentEndDate = now;
      previousStartDate = new Date(0); // No meaningful previous period for All Time
      previousEndDate = new Date(0); // Set to epoch start to avoid issues
    } else {
      // Default to Last 30 Days if timePeriod is not recognized
      currentEndDate = now;
      currentStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30,
      );
      previousEndDate = currentStartDate;
      previousStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 60,
      );
    }

    currentPeriodWhereClause = {
      createdAt: { gte: currentStartDate, lt: currentEndDate },
    };
    previousPeriodWhereClause = {
      createdAt: { gte: previousStartDate, lt: previousEndDate },
    };

    // Helper to calculate percentage change
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous) * 100;
    };

    // --- Current Period Data ---
    const currentTotalUsers = await prisma.user.count({
      where: currentPeriodWhereClause,
    });
    const currentTotalDesigns = await prisma.design.count({
      where: currentPeriodWhereClause,
    });
    const currentTotalOrders = await prisma.order.count({
      where: { status: "PAID", ...currentPeriodWhereClause },
    });
    const currentTotalSalesAggregate = await prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: "PAID", ...currentPeriodWhereClause },
    });
    const currentTotalSales = currentTotalSalesAggregate._sum.amount || 0;

    // --- Previous Period Data ---
    const previousTotalUsers = await prisma.user.count({
      where: previousPeriodWhereClause,
    });
    const previousTotalDesigns = await prisma.design.count({
      where: previousPeriodWhereClause,
    });
    const previousTotalOrders = await prisma.order.count({
      where: { status: "PAID", ...previousPeriodWhereClause },
    });
    const previousTotalSalesAggregate = await prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: "PAID", ...previousPeriodWhereClause },
    });
    const previousTotalSales = previousTotalSalesAggregate._sum.amount || 0;

    // --- Calculate Changes ---
    const usersChange = calculatePercentageChange(
      currentTotalUsers,
      previousTotalUsers,
    );
    const designsChange = calculatePercentageChange(
      currentTotalDesigns,
      previousTotalDesigns,
    );
    const ordersChange = calculatePercentageChange(
      currentTotalOrders,
      previousTotalOrders,
    );
    const salesChange = calculatePercentageChange(
      currentTotalSales,
      previousTotalSales,
    );

    const getChangeType = (change: number) => {
      if (change > 0) return "increase";
      if (change < 0) return "decrease";
      return "neutral";
    };

    const statsData = [
      {
        label: "Total Users",
        value: currentTotalUsers.toString(),
        change: `${usersChange >= 0 ? "+" : ""}${usersChange.toFixed(1)}%`,
        changeType: getChangeType(usersChange),
      },
      {
        label: "Total Designs",
        value: currentTotalDesigns.toString(),
        change: `${designsChange >= 0 ? "+" : ""}${designsChange.toFixed(1)}%`,
        changeType: getChangeType(designsChange),
      },
      {
        label: "Total Orders",
        value: currentTotalOrders.toString(),
        change: `${ordersChange >= 0 ? "+" : ""}${ordersChange.toFixed(1)}%`,
        changeType: getChangeType(ordersChange),
      },
      {
        label: "Total Sales",
        value: `${currentTotalSales.toFixed(2)}`,
        change: `${salesChange >= 0 ? "+" : ""}${salesChange.toFixed(1)}%`,
        changeType: getChangeType(salesChange),
      },
    ];

    // --- Website Traffic Data ---
    // For website traffic, we'll aggregate loginHistory and referralVisit by day
    const dailyLogins = await prisma.loginHistory.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: currentPeriodWhereClause,
      orderBy: { createdAt: "asc" },
    });

    const dailyReferralVisits = await prisma.referralVisit.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: currentPeriodWhereClause,
      orderBy: { createdAt: "asc" },
    });

    const websiteTrafficMap = new Map<string, number>();

    // Initialize map with all days in the period to 0
    let loopDate = new Date(currentStartDate);
    while (loopDate < currentEndDate) {
      const dateKey = loopDate.toISOString().split("T")[0];
      websiteTrafficMap.set(dateKey, 0);
      loopDate.setDate(loopDate.getDate() + 1);
    }

    dailyLogins.forEach((item) => {
      const dateKey = item.createdAt.toISOString().split("T")[0];
      websiteTrafficMap.set(
        dateKey,
        (websiteTrafficMap.get(dateKey) || 0) + item._count.id,
      );
    });

    dailyReferralVisits.forEach((item) => {
      const dateKey = item.createdAt.toISOString().split("T")[0];
      websiteTrafficMap.set(
        dateKey,
        (websiteTrafficMap.get(dateKey) || 0) + item._count.id,
      );
    });

    const websiteTrafficData = Array.from(websiteTrafficMap.entries()).map(
      ([date, value]) => ({
        name: new Date(date).toLocaleDateString(), // Viewer-friendly date format
        value,
      }),
    );

    // --- Product Views Data (re-using existing logic, but ensuring timePeriod is applied) ---
    // Note: This still relies on the 'views' field on the Design model being updated elsewhere.
    // A separate task will address explicit product view tracking.
    const productViews = await prisma.design.findMany({
      where: currentPeriodWhereClause,
      orderBy: {
        views: "desc",
      },
      take: 10,
      select: {
        name: true,
        views: true,
      },
    });

    const productViewsData = productViews.map((item) => ({
      name: item.name,
      value: item.views,
    }));

    // --- Referral Sources Data (ensuring timePeriod is applied correctly) ---
    const userReferralSources = await prisma.user.groupBy({
      by: ["referralSource"],
      _count: {
        referralSource: true,
      },
      where: {
        referralSource: {
          not: null,
        },
        ...currentPeriodWhereClause,
      },
    });

    const visitReferralSources = await prisma.referralVisit.groupBy({
      by: ["source"],
      _count: {
        source: true,
      },
      where: currentPeriodWhereClause,
    });

    const combinedReferralSourcesMap = new Map<string, number>();

    userReferralSources.forEach((item) => {
      if (item.referralSource) {
        combinedReferralSourcesMap.set(
          item.referralSource,
          (combinedReferralSourcesMap.get(item.referralSource) || 0) +
            item._count.referralSource,
        );
      }
    });

    visitReferralSources.forEach((item) => {
      combinedReferralSourcesMap.set(
        item.source,
        (combinedReferralSourcesMap.get(item.source) || 0) + item._count.source,
      );
    });

    const referralSourcesData = Array.from(
      combinedReferralSourcesMap.entries(),
    ).map(([name, value]) => ({
      name,
      value,
    }));

    // --- Conversion Rate Data (ensuring timePeriod is applied correctly) ---
    const totalSessions = await prisma.session.count({
      where: currentPeriodWhereClause,
    });
    const conversionRate =
      currentTotalUsers > 0
        ? (currentTotalOrders / currentTotalUsers) * 100
        : 0; // Orders per User

    const conversionRateData = {
      converted: conversionRate.toFixed(2),
      rate: conversionRate.toFixed(2),
    };

    return NextResponse.json({
      statsData,
      websiteTrafficData,
      productViewsData,
      referralSourcesData,
      conversionRateData,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
