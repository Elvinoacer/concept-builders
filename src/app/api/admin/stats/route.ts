import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalSales = await prisma.order.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'PAID',
      },
    });

    const totalVisitors = await prisma.referralVisit.count();

    const totalOrders = await prisma.order.count();

    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

    const stats = {
      totalSales: totalSales._sum.amount || 0,
      totalVisitors,
      totalOrders,
      conversionRate,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
