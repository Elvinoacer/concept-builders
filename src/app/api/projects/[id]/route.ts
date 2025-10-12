
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });
    if (!project) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
