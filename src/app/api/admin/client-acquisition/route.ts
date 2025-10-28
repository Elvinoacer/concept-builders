import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Go back 5 months to include the current month as one of the six
    sixMonthsAgo.setDate(1); // Start from the first day of that month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const referralVisits = await prisma.referralVisit.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
      },
    });

    // Initialize acquisition data for the last six months
    const monthlyAcquisitionMap = new Map<string, { month: string; count: number }>();
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${monthName} ${year}`;
      monthlyAcquisitionMap.set(key, { month: monthName, count: 0 });
    }

    // Aggregate acquisitions
    referralVisits.forEach(visit => {
      const monthName = visit.createdAt.toLocaleString('default', { month: 'short' });
      const year = visit.createdAt.getFullYear();
      const key = `${monthName} ${year}`;
      if (monthlyAcquisitionMap.has(key)) {
        const current = monthlyAcquisitionMap.get(key)!;
        current.count += 1;
        monthlyAcquisitionMap.set(key, current);
      }
    });

    // Convert map to array and sort by date to ensure correct order
    const sortedMonthlyAcquisition = Array.from(monthlyAcquisitionMap.values()).sort((a, b) => {
      const dateA = new Date(`1 ${a.month} 2000`); // Use a dummy year for comparison
      const dateB = new Date(`1 ${b.month} 2000`);
      return dateA.getMonth() - dateB.getMonth();
    });

    return NextResponse.json(sortedMonthlyAcquisition);
  } catch (error) {
    console.error('Error fetching client acquisition:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
