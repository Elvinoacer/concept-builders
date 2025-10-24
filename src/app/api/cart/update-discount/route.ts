import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { discountAmount, discountId, discountCode } = await req.json();

    if (discountAmount === undefined || !discountId || !discountCode) {
      return NextResponse.json({ message: 'Missing discount details' }, { status: 400 });
    }

    const userId = session.user.id;

    // Find the user's cart
    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    // Update the cart with discount details
    const updatedCart = await prisma.cart.update({
      where: { id: userCart.id },
      data: {
        discountAmount: parseFloat(discountAmount),
        discountId: discountId,
        discountCode: discountCode,
      },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error('Error updating cart with discount:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
