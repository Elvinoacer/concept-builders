import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json({ message: 'Cart ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { cartId: cartId },
      select: { id: true, status: true },
    });

    if (order) {
      return NextResponse.json({ orderId: order.id, status: order.status }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'NOT_FOUND' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking order status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
