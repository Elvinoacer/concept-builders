import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const featuredCategories = await prisma.category.findMany({
      take: 4,
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: { designs: true },
        },
      },
    });

    const designs = await prisma.design.findMany({
      include: {
        orderItems: true,
        files: {
          where: {
            type: 'IMAGE',
          },
        },
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          }
        }
      },
    });

    const designsWithSalesCount = designs.map((design) => ({
      ...design,
      salesCount: design.orderItems.length,
    }));

    const bestSellingPlans = designsWithSalesCount
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 4);

    const newPlans = await prisma.design.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
      include: {
        files: {
          where: {
            type: 'IMAGE',
          },
        },
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          }
        }
      },
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
