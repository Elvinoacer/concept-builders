import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const acquisition = await prisma.referralVisit.groupBy({
      by: ['source'],
      _count: {
        source: true,
      },
    });

    const clientAcquisition = acquisition.map((a) => ({
      source: a.source,
      count: a._count.source,
    }));

    return NextResponse.json(clientAcquisition);
  } catch (error) {
    console.error('Error fetching client acquisition:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
