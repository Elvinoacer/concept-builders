import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id: slug,
      },
    });

    if (!post) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog post fetched successfully', data: post }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
