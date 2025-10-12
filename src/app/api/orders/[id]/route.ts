
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { user: true, items: true },
    });
    if (!order) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
