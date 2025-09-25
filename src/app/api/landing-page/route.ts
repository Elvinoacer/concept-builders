import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const featuredCategories = await prisma.category.findMany({
      take: 4,
      include: {
        _count: {
          select: { designs: true },
        },
      },
    });

    const bestSellingPlans = await prisma.design.findMany({
      orderBy: {
        salesCount: 'desc',
      },
      take: 4,
    });

    const newPlans = await prisma.design.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    });

    const testimonials = await prisma.testimonial.findMany({
      take: 5,
    });

    const recentPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    return NextResponse.json({
      featuredCategories,
      bestSellingPlans,
      newPlans,
      testimonials,
      recentPosts,
    });
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
