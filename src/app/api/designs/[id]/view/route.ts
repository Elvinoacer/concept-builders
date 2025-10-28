import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const designId = params.id;
  const session = await getServerSession(authOptions);

  if (!designId) {
    return new NextResponse('Design ID is required', { status: 400 });
  }

  try {
    // Increment the views count on the Design model
    await prisma.design.update({
      where: { id: designId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // Create a new DesignView record
    await prisma.designView.create({
      data: {
        designId: designId,
        userId: session?.user?.id, // Link to user if logged in
      },
    });

    return new NextResponse('View tracked successfully', { status: 200 });
  } catch (error) {
    console.error('Error tracking design view:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
