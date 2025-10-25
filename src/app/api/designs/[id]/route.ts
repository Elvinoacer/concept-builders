import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        files: true,
        reviews: {
          include: {
            author: true,
          },
        },
        category: true,
      },
    });

    if (!design) {
      return new NextResponse("Design not found", { status: 404 });
    }

    return NextResponse.json(design, { status: 200 });
  } catch (error) {
    console.error("Error fetching design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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
      folderId,
      buildingCostEstimates,
      buildingCostFactors,
      packageOptions,
      files,
      minBuildingCost,
      maxBuildingCost,
      faq,
      pdfPrice,
      cadPrice,
      pdfAndCadPrice,
    } = body;

    if (!name || !description || !basePrice || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedDesign = await prisma.design.update({
      where: { id },
      data: {
        name,
        description,
        basePrice,
        priceRange: priceRange || "",
        bedrooms,
        bathrooms,
        area,
        floors,
        categoryId,
        planDetails: planDetails || [],
        folderId,
        buildingCostEstimates,
        buildingCostFactors,
        packageOptions,
        minBuildingCost,
        maxBuildingCost,
        faq,
        pdfPrice,
        cadPrice,
        pdfAndCadPrice,
        files: {
          deleteMany: {},
          create: files.map(
            (file: { url: string; type: string; originalFileName: string }) => ({
              url: file.url,
              type: file.type,
              originalFileName: file.originalFileName,
            })
          ),
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

    return NextResponse.json(updatedDesign, { status: 200 });
  } catch (error) {
    console.error("Error updating design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Fetch the design and its files
    const design = await prisma.design.findUnique({
      where: { id },
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
    // if (fileKeys.length > 0) {
    //   await deleteFiles(fileKeys);
    // }

    // 4. Delete the design from the database (Prisma will cascade delete related files)
    await prisma.design.delete({
      where: { id },
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
