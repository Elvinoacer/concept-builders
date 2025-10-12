import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timePeriod = searchParams.get("timePeriod") || "Last 30 Days";

    let whereClause = {};
    const now = new Date();

    if (timePeriod === "Today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      whereClause = { createdAt: { gte: today, lt: tomorrow } };
    } else if (timePeriod === "Last 7 Days") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      whereClause = { createdAt: { gte: sevenDaysAgo, lt: today } };
    } else if (timePeriod === "Last 30 Days") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      whereClause = { createdAt: { gte: thirtyDaysAgo, lt: today } };
    }

    const totalUsers = await prisma.user.count({ where: whereClause });
    const totalDesigns = await prisma.design.count({ where: whereClause });
    const totalOrders = await prisma.order.count({ where: whereClause });
    const totalSales = await prisma.order.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'PAID',
        ...whereClause,
      },
    });

    const websiteTraffic = await prisma.loginHistory.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'asc',
      },
      take: 100,
    });

    const productViews = await prisma.design.findMany({
      where: whereClause,
      orderBy: {
        views: 'desc',
      },
      take: 10,
      select: {
        name: true,
        views: true,
      },
    });

    const userReferralSources = await prisma.user.groupBy({
      by: ['referralSource'],
      _count: {
        referralSource: true,
      },
      where: {
        referralSource: {
          not: null,
        },
        ...whereClause,
      },
    });

    const visitReferralSources = await prisma.referralVisit.groupBy({
      by: ['source'],
      _count: {
        source: true,
      },
      where: whereClause,
    });

    const combinedReferralSourcesMap = new Map<string, number>();

    userReferralSources.forEach(item => {
      if (item.referralSource) {
        combinedReferralSourcesMap.set(item.referralSource, (combinedReferralSourcesMap.get(item.referralSource) || 0) + item._count.referralSource);
      }
    });

    visitReferralSources.forEach(item => {
      combinedReferralSourcesMap.set(item.source, (combinedReferralSourcesMap.get(item.source) || 0) + item._count.source);
    });

    const referralSourcesData = Array.from(combinedReferralSourcesMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const totalSessions = await prisma.session.count({ where: whereClause });
    const conversionRate = totalOrders > 0 ? (totalOrders / totalSessions) * 100 : 0;

    const statsData = [
      {
        label: 'Total Users',
        value: totalUsers.toString(),
        change: '+0%',
        changeType: 'increase',
      },
      {
        label: 'Total Designs',
        value: totalDesigns.toString(),
        change: '+0%',
        changeType: 'increase',
      },
      {
        label: 'Total Orders',
        value: totalOrders.toString(),
        change: '+0%',
        changeType: 'increase',
      },
      {
        label: 'Total Sales',
        value: `$${totalSales._sum.amount?.toFixed(2) ?? '0.00'}`,
        change: '+0%',
        changeType: 'increase',
      },
    ];

    return NextResponse.json({
      statsData,
      websiteTrafficData: websiteTraffic.map((item) => ({ name: item.createdAt.toDateString(), value: 1 })),
      productViewsData: productViews.map((item) => ({ name: item.name, value: item.views })),
      referralSourcesData: referralSourcesData,
      conversionRateData: {
        converted: conversionRate.toFixed(2),
        rate: conversionRate.toFixed(2),
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}