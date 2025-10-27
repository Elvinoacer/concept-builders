
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const referralInfo = {
    referralCode: 'BUILDDREAM',
    totalReferrals: 12,
    earnedBonus: 500,
    pendingBonus: 100,
  };

  return NextResponse.json(referralInfo);
}
