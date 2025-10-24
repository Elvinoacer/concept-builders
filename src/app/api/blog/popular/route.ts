import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const popularPosts = await prisma.post.findMany({
      take: 3, // Get at most 3 popular posts
      orderBy: {
        createdAt: 'desc', // Assuming most recent posts are considered popular for now
      },
      // In a real application, you might order by a 'views' count or a 'popularityScore'
      // where: { views: { gt: 0 } }, // Example if you had a views field
    });

    return NextResponse.json({
      success: true,
      message: 'Popular blog posts fetched successfully',
      data: popularPosts,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching popular blog posts:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
