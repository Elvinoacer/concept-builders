import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Go back 5 months to include the current month as one of the six
    sixMonthsAgo.setDate(1); // Start from the first day of that month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
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
      const monthName = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${monthName} ${year}`;
      monthlySalesMap.set(key, { month: monthName, sales: 0 });
    }

    // Aggregate sales
    orders.forEach(order => {
      const monthName = order.createdAt.toLocaleString('default', { month: 'short' });
      const year = order.createdAt.getFullYear();
      const key = `${monthName} ${year}`;
      if (monthlySalesMap.has(key)) {
        const current = monthlySalesMap.get(key)!;
        current.sales += order.amount;
        monthlySalesMap.set(key, current);
      }
    });

    // Convert map to array and sort by date to ensure correct order
    const sortedMonthlySales = Array.from(monthlySalesMap.values()).sort((a, b) => {
      const dateA = new Date(`1 ${a.month} 2000`); // Use a dummy year for comparison
      const dateB = new Date(`1 ${b.month} 2000`);
      return dateA.getMonth() - dateB.getMonth();
    });

    return NextResponse.json(sortedMonthlySales);
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
