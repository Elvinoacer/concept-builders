import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        images: true,
        floorPlans: true,
        files: true,
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          },
        },
      },
    });

    if (!design) {
      return new NextResponse('Design not found', { status: 404 });
    }

    const allFiles = [
      ...(design.images || []),
      ...(design.floorPlans || []),
      ...(design.files || []),
      ...(design.architecturalDesign?.pdfFiles || []),
      ...(design.architecturalDesign?.cadFiles || []),
      ...(design.structuralDesign?.pdfFiles || []),
      ...(design.structuralDesign?.cadFiles || []),
      ...(design.billOfQuantities?.excelFiles || []),
    ];

    // Sort files by creation date, newest first
    allFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const paginatedFiles = allFiles.slice(skip, skip + limit);
    const totalPages = Math.ceil(allFiles.length / limit);

    return NextResponse.json({ files: paginatedFiles, totalPages });

  } catch (error) {
    console.error('Error fetching design files:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
