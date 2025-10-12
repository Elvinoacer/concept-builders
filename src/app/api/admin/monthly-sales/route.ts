import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.order.findMany({
      where: {
        status: 'PAID',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const monthlySales = sales.reduce((acc, sale) => {
      const month = new Date(sale.createdAt).toLocaleString('default', { month: 'short' });
      const year = new Date(sale.createdAt).getFullYear();
      const key = `${month} ${year}`;

      if (!acc[key]) {
        acc[key] = { month, sales: 0 };
      }

      acc[key].sales += sale.amount;

      return acc;
    }, {});

    return NextResponse.json(Object.values(monthlySales));
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
