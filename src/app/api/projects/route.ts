
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new NextResponse('User ID is required', { status: 400 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId: userId },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newProject = await prisma.project.create({ data });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
