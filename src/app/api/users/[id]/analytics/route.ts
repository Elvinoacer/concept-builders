import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = params.id;

  try {
    const { searchParams } = request.nextUrl;
    const timePeriod = searchParams.get("timePeriod") || "Last 6 Months";

    let startDate: Date;
    const now = new Date();

    if (timePeriod === "Last 1 Month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else if (timePeriod === "Last 6 Months") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    } else if (timePeriod === "Last 1 Year") {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else if (timePeriod === "All Time") {
      startDate = new Date(0); // Epoch start
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Default to Last 6 Months
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        referralCode: true,
        referredUsers: { select: { id: true } },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // --- Total Spending & Orders ---
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
        createdAt: { gte: startDate, lt: now },
        status: "PAID",
      },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const totalSpending = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;

    // Aggregate spending and orders by month
    const monthlySpendingMap = new Map<string, { spending: number; orders: number }>();
    orders.forEach(order => {
      const monthKey = formatMonthYear(order.createdAt);
      const current = monthlySpendingMap.get(monthKey) || { spending: 0, orders: 0 };
      current.spending += order.amount;
      current.orders += 1;
      monthlySpendingMap.set(monthKey, current);
    });

    // --- Design Views ---
    const designViews = await prisma.designView.findMany({
      where: {
        userId: userId,
        createdAt: { gte: startDate, lt: now },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const totalDesignViews = designViews.length;

    // Aggregate design views by month
    const monthlyDesignViewsMap = new Map<string, number>();
    designViews.forEach(view => {
      const monthKey = formatMonthYear(view.createdAt);
      monthlyDesignViewsMap.set(monthKey, (monthlyDesignViewsMap.get(monthKey) || 0) + 1);
    });

    // --- Login Activity ---
    const loginHistory = await prisma.loginHistory.findMany({
      where: {
        userId: userId,
        createdAt: { gte: startDate, lt: now },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const totalLogins = loginHistory.length;

    // Aggregate logins by month
    const monthlyLoginsMap = new Map<string, number>();
    loginHistory.forEach(login => {
      const monthKey = formatMonthYear(login.createdAt);
      monthlyLoginsMap.set(monthKey, (monthlyLoginsMap.get(monthKey) || 0) + 1);
    });

    // --- Referral Performance ---
    const totalReferredUsers = user.referredUsers.length;
    let totalReferralRevenue = 0;
    if (user.referralCode) {
      const referredUsersOrders = await prisma.order.findMany({
        where: {
          user: {
            referredByCode: user.referralCode,
          },
          createdAt: { gte: startDate, lt: now },
          status: "PAID",
        },
        select: { amount: true },
      });
      totalReferralRevenue = referredUsersOrders.reduce((sum, order) => sum + order.amount, 0);
    }

    // --- Prepare Chart Data ---
    const chartData: any[] = [];
    let currentChartDate = new Date(startDate);
    while (currentChartDate <= now) {
      const monthKey = formatMonthYear(currentChartDate);
      chartData.push({
        date: monthKey,
        spending: monthlySpendingMap.get(monthKey)?.spending || 0,
        orders: monthlySpendingMap.get(monthKey)?.orders || 0,
        designViews: monthlyDesignViewsMap.get(monthKey) || 0,
        logins: monthlyLoginsMap.get(monthKey) || 0,
      });
      currentChartDate.setMonth(currentChartDate.getMonth() + 1);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        referralCode: user.referralCode,
      },
      summary: {
        totalSpending,
        totalOrders,
        totalDesignViews,
        totalReferredUsers,
        totalReferralRevenue,
      },
      chartData,
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function formatMonthYear(date: Date): string {
  return new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' });
}