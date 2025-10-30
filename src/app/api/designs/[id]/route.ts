import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          }
        }
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
    

    if (body.architecturalDesign) {
      updateData.architecturalDesign = {
        upsert: {
          create: {
            type: 'ARCHITECTURAL',
            description: body.architecturalDesign.description,
            overview: body.architecturalDesign.overview,
            pdfFiles: {
              create: body.architecturalDesign.pdfFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'PDF',
              })),
            },
            cadFiles: {
              create: body.architecturalDesign.cadFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'CAD',
              })),
            },
          },
          update: {
            description: body.architecturalDesign.description,
            overview: body.architecturalDesign.overview,
            pdfFiles: {
              deleteMany: {},
              create: body.architecturalDesign.pdfFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'PDF',
              })),
            },
            cadFiles: {
              deleteMany: {},
              create: body.architecturalDesign.cadFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'CAD',
              })),
            },
          },
        },
      };
    }

    if (body.structuralDesign) {
      updateData.structuralDesign = {
        upsert: {
          create: {
            type: 'STRUCTURAL',
            description: body.structuralDesign.description,
            overview: body.structuralDesign.overview,
            pdfFiles: {
              create: body.structuralDesign.pdfFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'PDF',
              })),
            },
            cadFiles: {
              create: body.structuralDesign.cadFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'CAD',
              })),
            },
          },
          update: {
            description: body.structuralDesign.description,
            overview: body.structuralDesign.overview,
            pdfFiles: {
              deleteMany: {},
              create: body.structuralDesign.pdfFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'PDF',
              })),
            },
            cadFiles: {
              deleteMany: {},
              create: body.structuralDesign.cadFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'CAD',
              })),
            },
          },
        },
      };
    }

    if (body.billOfQuantities) {
      updateData.billOfQuantities = {
        upsert: {
          create: {
            type: 'BILL_OF_QUANTITIES',
            description: body.billOfQuantities.description,
            overview: body.billOfQuantities.overview,
            excelFiles: {
              create: body.billOfQuantities.excelFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'EXCEL',
              })),
            },
          },
          update: {
            description: body.billOfQuantities.description,
            overview: body.billOfQuantities.overview,
            excelFiles: {
              deleteMany: {},
              create: body.billOfQuantities.excelFiles.map((file: any) => ({
                name: file.name,
                url: file.url,
                type: 'EXCEL',
              })),
            },
          },
        },
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

    revalidatePath('/');

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
      include: { 
        files: true,
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          }
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          }
        }
      },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // 2. Extract keys for DO Spaces deletion
    const fileKeys: string[] = [];
    if (design.architecturalDesign) {
      design.architecturalDesign.pdfFiles.forEach(file => {
        try {
          const url = new URL(file.url);
          fileKeys.push(url.pathname.substring(1));
        } catch (error) {
          console.error(`Invalid URL found for file ${file.id}: ${file.url}`);
        }
      });
      design.architecturalDesign.cadFiles.forEach(file => {
        try {
          const url = new URL(file.url);
          fileKeys.push(url.pathname.substring(1));
        } catch (error) {
          console.error(`Invalid URL found for file ${file.id}: ${file.url}`);
        }
      });
    }
    if (design.structuralDesign) {
      design.structuralDesign.pdfFiles.forEach(file => {
        try {
          const url = new URL(file.url);
          fileKeys.push(url.pathname.substring(1));
        } catch (error) {
          console.error(`Invalid URL found for file ${file.id}: ${file.url}`);
        }
      });
      design.structuralDesign.cadFiles.forEach(file => {
        try {
          const url = new URL(file.url);
          fileKeys.push(url.pathname.substring(1));
        } catch (error) {
          console.error(`Invalid URL found for file ${file.id}: ${file.url}`);
        }
      });
    }
    if (design.billOfQuantities) {
      design.billOfQuantities.excelFiles.forEach(file => {
        try {
          const url = new URL(file.url);
          fileKeys.push(url.pathname.substring(1));
        } catch (error) {
          console.error(`Invalid URL found for file ${file.id}: ${file.url}`);
        }
      });
    }

    // 3. Delete files from DigitalOcean Spaces
    // if (fileKeys.length > 0) {
    //   await deleteFiles(fileKeys);
    // }

    // 4. Delete the design from the database (Prisma will cascade delete related files)
    await prisma.design.delete({
      where: { id },
    });

    revalidatePath('/');

    return NextResponse.json({ message: "Design and associated files deleted successfully" });
  } catch (error) {
    console.error("Error deleting design and files:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}