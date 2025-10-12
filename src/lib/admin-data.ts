
import prisma from './prisma';

export const getAdminStats = async () => {
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

  return {
    totalSales: totalSales._sum.amount || 0,
    totalVisitors,
    totalOrders,
    conversionRate,
  };
};

export const getMonthlySales = async () => {
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

  return Object.values(monthlySales);
};

export const getClientAcquisition = async () => {
  const acquisition = await prisma.referralVisit.groupBy({
    by: ['source'],
    _count: {
      source: true,
    },
  });

  return acquisition.map((a) => ({
    source: a.source,
    count: a._count.source,
  }));
};
