
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
