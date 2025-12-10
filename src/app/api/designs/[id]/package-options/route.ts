
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: designId } = params;
    const body = await req.json();
    const { name, price, file } = body;

    if (!name || !price) {
      return new NextResponse('Missing name or price', { status: 400 });
    }

    const packageOptionData: any = {
      name,
      price: parseFloat(price),
      design: {
        connect: { id: designId },
      },
    };

    if (file) {
      packageOptionData.file = {
        create: {
          name: file.originalFileName,
          url: file.url,
          type: 'FILE',
          version: 1,
          isLatest: true,
          fileIdentifier: file.originalFileName,
        },
      };
    }

    const newPackageOption = await prisma.packageOption.create({
      data: packageOptionData,
      include: {
        file: true,
      },
    });

    return NextResponse.json(newPackageOption, { status: 201 });
  } catch (error) {
    console.error('Error creating package option:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}
