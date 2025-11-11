import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrlForUpload } from "@/lib/do-spaces";
import { FileType } from "@/generated/prisma"; // Import the Prisma enum

// The robust file type validation from your snippet
const allowedFileTypesByCategory = {
  CAD: [
    "application/acad",
    "application/dwg",
    "application/x-dwg",
    "image/vnd.dwg",
    "application/dxf",
    "image/vnd.dxf",
    "application/x-dxf",
    "application/step",
    "application/x-step",
    "application/STEP",
    "application/iges",
    "application/x-iges",
    "application/sla",
    "application/vnd.stl",
    "model/stl",
    "model/obj",
    "application/x-t-object",
    "model/3mf",
    "application/vnd.ms-pki.3mf",
    "application/octet-stream", // Often a fallback for .dwg
  ],
  PDF: ["application/pdf"],
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"],
  FLOOR_PLAN: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "image/avif",
  ],
  FILE: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    ".doc",
    ".docx",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream",
  ],
  EXCEL: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { designId, documentType, fileType, fileName, contentType } =
      await req.json();

    // 1. Validate all required fields are present
    if (!designId || !documentType || !fileType || !fileName || !contentType) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // 2. Perform the strict file type validation
    const allowedTypes =
      allowedFileTypesByCategory[
        fileType as keyof typeof allowedFileTypesByCategory
      ];

    if (!allowedTypes) {
      return new NextResponse(
        JSON.stringify({ error: `Invalid file type category: ${fileType}` }),
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(contentType)) {
      return new NextResponse(
        JSON.stringify({
          error: `Unsupported content type (${contentType}) for category ${fileType}`,
        }),
        { status: 400 }
      );
    }

    // 3. Map the string 'fileType' to the Prisma FileType enum
    let prismaFileType: FileType;
    if (fileType === "PDF") {
      prismaFileType = FileType.PDF;
    } else if (fileType === "CAD") {
      prismaFileType = FileType.CAD;
    } else if (fileType === "EXCEL") {
      prismaFileType = FileType.EXCEL;
    } else {
      // Handle other types or throw an error if needed
      return new NextResponse(
        JSON.stringify({ error: `Invalid file type: ${fileType}` }),
        { status: 400 }
      );
    }

    // 4. Get signed URL from our helper (this generates the unique key)
    const { signedUrl, publicUrl, key } = await getSignedUrlForUpload(
      fileName,
      contentType
    );

    // 5. Find or create the parent DesignDocument
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
      const data: any = { type: documentType };
      if (documentType === "ARCHITECTURAL") {
        data.architecturalDesign = { connect: { id: designId } };
      } else if (documentType === "STRUCTURAL") {
        data.structuralDesign = { connect: { id: designId } };
      } else if (documentType === "BILL_OF_QUANTITIES") {
        data.billOfQuantities = { connect: { id: designId } };
      }
      designDocument = await prisma.designDocuments.create({ data });
    }

    // 6. Handle file versioning
    const existingFile = await prisma.file.findFirst({
      where: {
        name: fileName, // Use 'name' for original filename comparison
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
      // Set the previous version to not be the latest
      await prisma.file.update({
        where: { id: existingFile.id },
        data: { isLatest: false },
      });
    }

    // 7. Create the new File record in the database
    const fileData: any = {
      name: fileName,
      url: publicUrl,
      key: key, // CRITICAL: Store the S3 key for future deletion
      type: prismaFileType,
      version: newVersion,
      isLatest: true,
      fileIdentifier: fileName, // Or you could use 'key' here
    };

    // Connect the file to its parent
    if (fileType === "PDF") {
      fileData.pdfDocument = { connect: { id: designDocument.id } };
    } else if (fileType === "CAD") {
      fileData.cadDocument = { connect: { id: designDocument.id } };
    } else if (fileType === "EXCEL") {
      fileData.excelDocument = { connect: { id: designDocument.id } };
    }

    await prisma.file.create({ data: fileData });

    // 8. Return the signed URL to the frontend
    return NextResponse.json({ signedUrl, publicUrl });
  } catch (error) {
    console.error("Error preparing upload:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}
