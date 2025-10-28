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

    const updateData: any = {};

    if ('name' in body) updateData.name = body.name;
    if ('description' in body) updateData.description = body.description;
    if ('basePrice' in body) updateData.basePrice = body.basePrice;
    if ('priceRange' in body) updateData.priceRange = body.priceRange;
    if ('bedrooms' in body) updateData.bedrooms = body.bedrooms;
    if ('bathrooms' in body) updateData.bathrooms = body.bathrooms;
    if ('area' in body) updateData.area = body.area;
    if ('floors' in body) updateData.floors = body.floors;
    if ('categoryId' in body) updateData.categoryId = body.categoryId;
    if ('planDetails' in body) updateData.planDetails = body.planDetails;
    if ('folderId' in body) updateData.folderId = body.folderId; // Can be null to unlink
    if ('buildingCostEstimates' in body) updateData.buildingCostEstimates = body.buildingCostEstimates;
    if ('buildingCostFactors' in body) updateData.buildingCostFactors = body.buildingCostFactors;
    if ('packageOptions' in body) updateData.packageOptions = body.packageOptions;
    if ('minBuildingCost' in body) updateData.minBuildingCost = body.minBuildingCost;
    if ('maxBuildingCost' in body) updateData.maxBuildingCost = body.maxBuildingCost;
    if ('faq' in body) updateData.faq = body.faq;
    if ('pdfPrice' in body) updateData.pdfPrice = body.pdfPrice;
    if ('cadPrice' in body) updateData.cadPrice = body.cadPrice;
    if ('pdfAndCadPrice' in body) updateData.pdfAndCadPrice = body.pdfAndCadPrice;

    // Handle files update only if 'files' is explicitly provided in the body
    if ('files' in body && Array.isArray(body.files)) {
      updateData.files = {
        deleteMany: {},
        create: body.files.map(
          (file: { url: string; type: string; originalFileName: string }) => ({
            url: file.url,
            type: file.type,
            originalFileName: file.originalFileName,
          })
        ),
      };
    }

    const updatedDesign = await prisma.design.update({
      where: { id },
      data: updateData,
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
