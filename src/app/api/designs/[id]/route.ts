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
        reviews: {
          include: {
            author: true,
          },
        },
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
      faq,
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
        faq,
        files: {
          deleteMany: {},
          create: files.map((file: { url: string; type: string; originalFileName: string }) => ({
            url: file.url,
            type: file.type,
            originalFileName: file.originalFileName,
          })),
        },
      },
      include: {
        files: true,
        reviews: {
          include: {
            author: true,
          },
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
    const resolvedParams = await params;
    const designId = resolvedParams.id;

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
      try {
        const url = new URL(file.url);
        return url.pathname.substring(1); // Remove leading '/'
      } catch (error) {
        console.error(`Invalid URL found for file ${file.id}: ${file.url}`);
        return null;
      }
    }).filter((key): key is string => key !== null);

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