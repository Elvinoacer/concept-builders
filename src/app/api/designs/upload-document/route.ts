import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSignedUrlForUpload } from '@/lib/do-spaces';

export async function POST(req: NextRequest) {
  try {
    const { designId, documentType, fileType, fileName, contentType } = await req.json();

    if (!designId || !documentType || !fileType || !fileName || !contentType) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // 1. Get signed URL
    const { signedUrl, publicUrl, key } = await getSignedUrlForUpload(fileName, contentType);

    // 2. Find or create DesignDocument
    let designDocument;
    if (documentType === 'ARCHITECTURAL') {
      designDocument = await prisma.designDocuments.findFirst({ where: { architecturalDesignId: designId } });
    } else if (documentType === 'STRUCTURAL') {
      designDocument = await prisma.designDocuments.findFirst({ where: { structuralDesignId: designId } });
    } else if (documentType === 'BILL_OF_QUANTITIES') {
      designDocument = await prisma.designDocuments.findFirst({ where: { billOfQuantitiesId: designId } });
    }

    if (!designDocument) {
      const data: any = { type: documentType };
      if (documentType === 'ARCHITECTURAL') {
        data.architecturalDesign = { connect: { id: designId } };
      } else if (documentType === 'STRUCTURAL') {
        data.structuralDesign = { connect: { id: designId } };
      } else if (documentType === 'BILL_OF_QUANTITIES') {
        data.billOfQuantities = { connect: { id: designId } };
      }
      designDocument = await prisma.designDocuments.create({ data });
    }

    // 3. Create File record
    const fileData = {
      name: fileName,
      url: publicUrl,
      type: fileType,
    };

    if (fileType === 'PDF') {
      await prisma.file.create({ data: { ...fileData, pdfDocumentId: designDocument.id } });
    } else if (fileType === 'CAD') {
      await prisma.file.create({ data: { ...fileData, cadDocumentId: designDocument.id } });
    } else if (fileType === 'EXCEL') {
      await prisma.file.create({ data: { ...fileData, excelDocumentId: designDocument.id } });
    }

    return NextResponse.json({ signedUrl, publicUrl });

  } catch (error) {
    console.error('Error getting signed URL:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}