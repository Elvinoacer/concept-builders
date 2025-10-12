import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!targetUser) {
    return new NextResponse('User not found', { status: 404 });
  }

  // @ts-ignore
  if (targetUser.role === 'ADMIN') {
    return new NextResponse('Cannot impersonate another admin', { status: 403 });
  }

  // @ts-ignore
  await prisma.user.update({
    // @ts-ignore
    where: { id: session.user.id },
    data: { impersonatingUserId: targetUser.id },
  });

  return NextResponse.json({ success: true });
}

