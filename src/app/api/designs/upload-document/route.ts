import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrlForUpload } from "@/lib/do-spaces";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FileType, Prisma } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { designId, documentType, fileType, fileName, contentType } =
      await req.json();

    if (!designId || !documentType || !fileType || !fileName || !contentType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 1. Get signed URL
    const { signedUrl, publicUrl } = await getSignedUrlForUpload(
      fileName,
      contentType,
    );

    // 2. Find or create DesignDocument
    let designDocument;
    if (documentType === "ARCHITECTURAL") {
      designDocument = await prisma.designDocuments.findFirst({
        where: { architecturalDesignId: designId },
      });
    } else if (documentType === "STRUCTURAL") {
      designDocument = await prisma.designDocuments.findFirst({
        where: { structuralDesignId: designId },
      });
    } else if (documentType === "BILL_OF_QUANTITIES") {
      designDocument = await prisma.designDocuments.findFirst({
        where: { billOfQuantitiesId: designId },
      });
    }

    if (!designDocument) {
      const data: Prisma.DesignDocumentsUncheckedCreateInput = {
        type: documentType as
          | "ARCHITECTURAL"
          | "STRUCTURAL"
          | "BILL_OF_QUANTITIES",
      };
      if (documentType === "ARCHITECTURAL") {
        data.architecturalDesignId = designId;
      } else if (documentType === "STRUCTURAL") {
        data.structuralDesignId = designId;
      } else if (documentType === "BILL_OF_QUANTITIES") {
        data.billOfQuantitiesId = designId;
      }
      designDocument = await prisma.designDocuments.create({ data });
    }

    // 3. Handle versioning
    const existingFile = await prisma.file.findFirst({
      where: {
        name: fileName,
        OR: [
          { pdfDocumentId: designDocument.id },
          { cadDocumentId: designDocument.id },
          { excelDocumentId: designDocument.id },
        ],
      },
      orderBy: {
        version: "desc",
      },
    });

    let newVersion = 1;
    if (existingFile) {
      newVersion = existingFile.version + 1;
      await prisma.file.update({
        where: { id: existingFile.id },
        data: { isLatest: false },
      });
    }

    // 4. Create File record
    const fileData: Prisma.FileUncheckedCreateInput = {
      name: fileName,
      url: publicUrl,
      type: fileType as FileType,
      version: newVersion,
      isLatest: true,
      fileIdentifier: fileName,
    };

    if (fileType === "PDF") {
      fileData.pdfDocumentId = designDocument.id;
    } else if (fileType === "CAD") {
      fileData.cadDocumentId = designDocument.id;
    } else if (fileType === "EXCEL") {
      fileData.excelDocumentId = designDocument.id;
    }

    await prisma.file.create({ data: fileData });

    return NextResponse.json({ signedUrl, publicUrl });
  } catch (error) {
    console.error("Error getting signed URL:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(message, { status: 500 });
  }
}
