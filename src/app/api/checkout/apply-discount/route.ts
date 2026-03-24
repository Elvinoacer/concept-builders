import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DiscountType } from '@/generated/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust path as needed

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { discountCode, cartTotal } = await req.json();
    const userId = session.user.id;

    if (!discountCode || cartTotal === undefined) {
      return NextResponse.json({ message: 'Missing discount code or cart total' }, { status: 400 });
    }

    const discount = await prisma.discount.findUnique({
      where: { code: discountCode },
    });

    if (!discount) {
      return NextResponse.json({ message: 'Invalid discount code' }, { status: 404 });
    }

    if (!discount.isActive) {
      return NextResponse.json({ message: 'Discount is not active' }, { status: 400 });
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return NextResponse.json({ message: 'Discount has expired' }, { status: 400 });
    }

    if (discount.maxUses && discount.uses >= discount.maxUses) {
      return NextResponse.json({ message: 'Discount has reached its maximum uses' }, { status: 400 });
    }

    if (discount.minPurchaseAmount && cartTotal < discount.minPurchaseAmount) {
      return NextResponse.json(
        { message: `Minimum purchase of ${discount.minPurchaseAmount.toFixed(2)} required` },
        { status: 400 }
      );
    }

    // Check if the user has already used this discount code
    const existingOrderWithDiscount = await prisma.order.findFirst({
      where: {
        userId: userId,
        discountId: discount.id,
        status: {
          in: ['PAID', 'REFUND_REQUESTED'], // Consider 'PAID' and potentially 'REFUND_REQUESTED' as used
        },
      },
    });

    if (existingOrderWithDiscount) {
      return NextResponse.json(
        { message: 'You have already used this discount code.' },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (discount.type === DiscountType.PERCENTAGE) {
      discountAmount = cartTotal * (discount.value / 100);
    } else if (discount.type === DiscountType.FIXED_AMOUNT) {
      discountAmount = discount.value;
    }

    // Ensure discount amount does not exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({ discountAmount, discountId: discount.id }, { status: 200 });
  } catch (error) {
    console.error('Error applying discount:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
