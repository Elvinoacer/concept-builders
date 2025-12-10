
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        bio: true,
        adminRole: true,
        referralCode: true,
        referredByCode: true,
        accounts: { select: { provider: true } },
        orders: { select: { id: true, amount: true, createdAt: true } },
        projects: { select: { id: true, name: true, status: true } },
        reviews: { select: { id: true, rating: true, comment: true } },
        wishlist: { select: { id: true, name: true } },
        folders: { select: { id: true, name: true } },
        loginHistory: { select: { createdAt: true, ipAddress: true }, orderBy: { createdAt: "desc" }, take: 5 }, // Latest 5 logins
      },
    });
    if (!user) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
