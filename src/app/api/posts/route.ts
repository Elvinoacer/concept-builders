
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { title, content, excerpt, image, author } = await request.json();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        image,
        author,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
