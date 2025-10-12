import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteFiles } from "@/lib/do-spaces";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const design = await prisma.design.findUnique({
      where: { id: params.id },
      include: {
        files: true,
      },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    return NextResponse.json(design);
  } catch (error) {
    console.error("Error fetching design:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      basePrice,
      priceRange,
      bedrooms,
      bathrooms,
      area,
      floors,
      categoryId,
      planDetails,
      buildingCostEstimates,
      calculatorOptions,
      files,
    } = body;

    const updatedDesign = await prisma.design.update({
      where: { id: params.id },
      data: {
        name,
        description,
        basePrice,
        priceRange,
        bedrooms,
        bathrooms,
        area,
        floors,
        categoryId,
        planDetails,
        buildingCostEstimates,
        calculatorOptions,
        files: {
          deleteMany: {},
          create: files.map((file: { url: string; type: string; originalFileName: string }) => ({
            url: file.url,
            type: file.type,
            originalFileName: file.originalFileName,
          })),
        },
      },
    });

    return NextResponse.json(updatedDesign);
  } catch (error) {
    console.error("Error updating design:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const designId = params.id;

    // 1. Fetch the design and its files
    const design = await prisma.design.findUnique({
      where: { id: designId },
      include: { files: true },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // 2. Extract keys for DO Spaces deletion
    const fileKeys = design.files.map(file => {
      const urlParts = file.url.split('/');
      // Assuming the URL format is like https://your-bucket.sfo3.digitaloceanspaces.com/key
      // The key should be the part after the domain, e.g., 'folder/filename.ext'
      // This might need adjustment based on the exact URL structure
      // For DigitalOcean Spaces, the key is usually everything after the bucket name in the path
      // Example: https://<bucket-name>.<region>.digitaloceanspaces.com/<key>
      // So, if urlParts[2] is the domain, urlParts[3] would be the start of the key
      return urlParts.slice(3).join('/');
    }).filter(key => key); // Filter out any empty keys

    // 3. Delete files from DigitalOcean Spaces
    if (fileKeys.length > 0) {
      await deleteFiles(fileKeys);
    }

    // 4. Delete the design from the database (Prisma will cascade delete related files)
    await prisma.design.delete({
      where: { id: designId },
    });

    return NextResponse.json({ message: "Design and associated files deleted successfully" });
  } catch (error) {
    console.error("Error deleting design and files:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}