
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fullName, email, phoneNumber } = await req.json();

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: fullName,
      email,
      phoneNumber,
    },
  });

  return NextResponse.json(user);
}
