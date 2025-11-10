
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

        const now = new Date();

        const currentYear = now.getFullYear();

        const currentMonth = now.getMonth();

    

        const currentMonthStart = new Date(currentYear, currentMonth, 1);

        const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

    

        const previousMonthDate = new Date(new Date().setMonth(currentMonth - 1));

        const previousMonthYear = previousMonthDate.getFullYear();

        const previousMonth = previousMonthDate.getMonth();

    

        const previousMonthStart = new Date(previousMonthYear, previousMonth, 1);

        const previousMonthEnd = new Date(previousMonthYear, previousMonth + 1, 0);

    

        // Helper function to calculate percentage change

        const calculateChange = (current, previous) => {

          if (previous === 0) {

            return current > 0 ? 100 : 0;

          }

          return ((current - previous) / previous) * 100;

        };

    

        // --- Current Month Calculations ---

        const currentRevenueResult = await prisma.order.aggregate({

          _sum: { amount: true },

          where: { status: "PAID", createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },

        });

        const currentRevenue = currentRevenueResult._sum.amount || 0;

    

        const currentOrders = await prisma.order.count({

          where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },

        });

    

            const currentVisitorsResult = await prisma.loginHistory.groupBy({

    

              by: ["userId"],

    

              where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },

    

            });

    

            const currentVisitors = currentVisitorsResult.length;

    

            

    

            const currentConversionRate = currentVisitors > 0 ? (currentOrders / currentVisitors) * 100 : 0;

    

        

    

            // --- Previous Month Calculations ---

    

            const previousRevenueResult = await prisma.order.aggregate({

    

              _sum: { amount: true },

    

              where: { status: "PAID", createdAt: { gte: previousMonthStart, lte: previousMonthEnd } },

    

            });

    

            const previousRevenue = previousRevenueResult._sum.amount || 0;

    

        

    

            const previousOrders = await prisma.order.count({

    

              where: { createdAt: { gte: previousMonthStart, lte: previousMonthEnd } },

    

            });

    

        

    

            const previousVisitorsResult = await prisma.loginHistory.groupBy({

    

              by: ["userId"],

    

              where: { createdAt: { gte: previousMonthStart, lte: previousMonthEnd } },

    

            });

    

            const previousVisitors = previousVisitorsResult.length;

    

        

    

            const previousConversionRate = previousVisitors > 0 ? (previousOrders / previousVisitors) * 100 : 0;

    

        

    

            // --- Change Calculations ---

    

            const revenueChange = calculateChange(currentRevenue, previousRevenue);

    

            const visitorsChange = calculateChange(currentVisitors, previousVisitors);

    

            const ordersChange = calculateChange(currentOrders, previousOrders);

    

            const conversionRateChange = calculateChange(currentConversionRate, previousConversionRate);

    

        

    

            // --- Overall Stats ---

    

            const totalRevenue = await prisma.order.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }).then(res => res._sum.amount || 0);

    

            const totalOrders = await prisma.order.count();

    

            const totalVisitorsResult = await prisma.loginHistory.groupBy({ by: ["userId"] });

    

            const totalVisitors = totalVisitorsResult.length;

    

            const totalConversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

    

            const totalUsers = await prisma.user.count();

    

            const totalProjects = await prisma.project.count({ where: { status: "IN_PROGRESS" } });

    

        const kpis = {

          kpis: [

            {

              title: "Total Revenue",

              key: "totalSales",

              prefix: "$",

              value: totalRevenue,

              change: `${revenueChange.toFixed(1)}%`,

              icon: "monetization_on",

              positive: revenueChange >= 0,

            },

            {

              title: "Total Visitors",

              key: "totalVisitors",

              prefix: "",

              value: totalVisitors,

              change: `${visitorsChange.toFixed(1)}%`,

              icon: "people",

              positive: visitorsChange >= 0,

            },

            {

              title: "Conversion Rate",

              key: "conversionRate",

              suffix: "%",

              value: parseFloat(totalConversionRate.toFixed(2)),

              change: `${conversionRateChange.toFixed(1)}%`,

              icon: "touch_app",

              positive: conversionRateChange >= 0,

            },

            {

              title: "Total Orders",

              key: "totalOrders",

              prefix: "",

              value: totalOrders,

              change: `${ordersChange.toFixed(1)}%`,

              icon: "shopping_cart",

              positive: ordersChange >= 0,

            },

          ],

          totalUsers,

          totalProjects,

          totalRevenue,

          conversionRate: parseFloat(totalConversionRate.toFixed(2)),

        };

    

        return NextResponse.json(kpis);
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
