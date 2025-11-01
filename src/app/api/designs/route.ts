import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const priceType = searchParams.get("priceType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const styles = searchParams.get("styles")?.split(",");
    const minSize = searchParams.get("minSize");
    const maxSize = searchParams.get("maxSize");
    const sortBy = searchParams.get("sortBy");
    const categoryId = searchParams.get("categoryId");
    const exclude = searchParams.get("exclude");
    const isFeatured = searchParams.get("isFeatured");

    const where: any = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };

    if (priceType === "design" && (minPrice || maxPrice)) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    } else if (priceType === "building" && (minPrice || maxPrice)) {
      where.minBuildingCost = {};
      if (minPrice) where.minBuildingCost.gte = parseFloat(minPrice);
      if (maxPrice) where.maxBuildingCost = { lte: parseFloat(maxPrice) };
    }

    if (bedrooms) {
      if (bedrooms === "4+") {
        where.bedrooms = { gte: 4 };
      } else {
        where.bedrooms = parseInt(bedrooms);
      }
    }

    if (styles && styles.length > 0) {
      const categories = await prisma.category.findMany({
        where: {
          name: {
            in: styles,
          },
        },
      });
      const categoryIds = categories.map((c) => c.id);
      where.categoryId = { in: categoryIds };
    }

    if (minSize || maxSize) {
      where.area = {};
      if (minSize) where.area.gte = parseFloat(minSize);
      if (maxSize) where.area.lte = parseFloat(maxSize);
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (exclude) {
      where.id = { not: exclude };
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy) {
      switch (sortBy) {
        case "Popular":
          orderBy = { views: "desc" };
          break;
        case "Price (Low to High)":
          orderBy = { basePrice: "asc" };
          break;
        case "Price (High to Low)":
          orderBy = { basePrice: "desc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }
    }

    const designs = await prisma.design.findMany({
      where,
      skip,
      take: limit,
      include: {
        images: true,
        files: true,
        reviews: true,
        category: true,
        discounts: {
          include: {
            discount: true,
          },
        },
        orderItems: true,
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
      orderBy,
    });

    const totalDesigns = await prisma.design.count({ where });

    return NextResponse.json({
      designs,
      totalPages: Math.ceil(totalDesigns / limit),
    });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
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
      folderId,
      buildingCostEstimates,
      buildingCostFactors,
      packageOptions,
      images,
      floorPlans,
      minBuildingCost,
      maxBuildingCost,
      architecturalPdfPrice,
      architecturalCadPrice,
      structuralPdfPrice,
      structuralCadPrice,
      billOfQuantitiesPrice,
      architecturalDesign,
      structuralDesign,
      billOfQuantities,
    } = body;

    // More robust validation
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('Design Name is required.');
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
      errors.push('Description is required.');
    }
    if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
      errors.push('Category is required.');
    }
    if (!basePrice || typeof basePrice !== 'number' || basePrice <= 0) {
      errors.push('Base Price must be a positive number.');
    }
    if (!images || !images.create || !Array.isArray(images.create) || images.create.length === 0) {
      errors.push('At least one image is required.');
    }

    if (errors.length > 0) {
      return new NextResponse(errors.join('\n'), { status: 400 });
    }

    // Build the design data with safe defaults
    const designData: any = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      priceRange: priceRange || "",
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area: area ? parseFloat(area) : null,
      floors: floors ? parseInt(floors) : null,
      categoryId,
      planDetails: Array.isArray(planDetails)
        ? planDetails
        : planDetails
          ? [planDetails]
          : [],
      folderId: folderId || null,
      minBuildingCost: minBuildingCost ? parseFloat(minBuildingCost) : null,
      maxBuildingCost: maxBuildingCost ? parseFloat(maxBuildingCost) : null,
      architecturalPdfPrice: architecturalPdfPrice
        ? parseFloat(architecturalPdfPrice)
        : null,
      architecturalCadPrice: architecturalCadPrice
        ? parseFloat(architecturalCadPrice)
        : null,
      structuralPdfPrice: structuralPdfPrice
        ? parseFloat(structuralPdfPrice)
        : null,
      structuralCadPrice: structuralCadPrice
        ? parseFloat(structuralCadPrice)
        : null,
      billOfQuantitiesPrice: billOfQuantitiesPrice
        ? parseFloat(billOfQuantitiesPrice)
        : null,
    };

    // Handle buildingCostEstimates - FIXED for Json[] field
    if (buildingCostEstimates && Array.isArray(buildingCostEstimates)) {
      designData.buildingCostEstimates = buildingCostEstimates.map(
        (estimate) => ({
          tier: estimate.tier,
          description: estimate.description || "",
          costBreakdown: estimate.costBreakdown || [],
        })
      );
    } else {
      designData.buildingCostEstimates = [];
    }

    // Handle buildingCostFactors - FIXED for Json field
    if (
      buildingCostFactors &&
      buildingCostFactors.options &&
      Array.isArray(buildingCostFactors.options)
    ) {
      designData.buildingCostFactors = {
        options: buildingCostFactors.options.map((factor) => ({
          name: factor.name || "",
          unit: factor.unit || "",
          price: factor.price ? parseFloat(factor.price) : 0,
        })),
      };
    }

    // Handle packageOptions with files
    if (
      packageOptions &&
      packageOptions.create &&
      Array.isArray(packageOptions.create)
    ) {
      designData.packageOptions = {
        create: packageOptions.create.map((option) => {
          const packageData: any = {
            name: option.name || "",
            price: option.price ? parseFloat(option.price) : 0,
          };

          // Only include file if it exists and has data
          if (
            option.file &&
            option.file.create &&
            option.file.create.name &&
            option.file.create.url
          ) {
            packageData.file = {
              create: {
                name: option.file.create.name,
                url: option.file.create.url,
                type: option.file.create.type || "FILE",
              },
            };
          }

          return packageData;
        }),
      };
    }

    // Handle images
    if (images && images.create && Array.isArray(images.create)) {
      designData.images = {
        create: images.create.map((image: any) => ({
          name: image.name,
          url: image.url,
          type: "IMAGE",
        })),
      };
    }

    // Handle floorPlans
    if (floorPlans && floorPlans.create && Array.isArray(floorPlans.create)) {
      designData.floorPlans = {
        create: floorPlans.create.map((plan: any) => ({
          name: plan.name,
          url: plan.url,
          type: "FLOOR_PLAN",
        })),
      };
    }

    // Handle architecturalDesign - FIXED for relation structure
    if (architecturalDesign && architecturalDesign.create) {
      const archData: any = {
        type: "ARCHITECTURAL",
        description: architecturalDesign.create.description || "",
        overview: architecturalDesign.create.overview || "",
      };

      // Handle PDF files
      if (
        architecturalDesign.create.pdfFiles &&
        architecturalDesign.create.pdfFiles.create &&
        Array.isArray(architecturalDesign.create.pdfFiles.create)
      ) {
        archData.pdfFiles = {
          create: architecturalDesign.create.pdfFiles.create.map(
            (file: any) => ({
              name: file.name,
              url: file.url,
              type: "PDF",
            })
          ),
        };
      }

      // Handle CAD files
      if (
        architecturalDesign.create.cadFiles &&
        architecturalDesign.create.cadFiles.create &&
        Array.isArray(architecturalDesign.create.cadFiles.create)
      ) {
        archData.cadFiles = {
          create: architecturalDesign.create.cadFiles.create.map(
            (file: any) => ({
              name: file.name,
              url: file.url,
              type: "CAD",
            })
          ),
        };
      }

      designData.architecturalDesign = { create: archData };
    }

    // Handle structuralDesign - FIXED for relation structure
    if (structuralDesign && structuralDesign.create) {
      const structData: any = {
        type: "STRUCTURAL",
        description: structuralDesign.create.description || "",
        overview: structuralDesign.create.overview || "",
      };

      if (
        structuralDesign.create.pdfFiles &&
        structuralDesign.create.pdfFiles.create &&
        Array.isArray(structuralDesign.create.pdfFiles.create)
      ) {
        structData.pdfFiles = {
          create: structuralDesign.create.pdfFiles.create.map((file: any) => ({
            name: file.name,
            url: file.url,
            type: "PDF",
          })),
        };
      }

      if (
        structuralDesign.create.cadFiles &&
        structuralDesign.create.cadFiles.create &&
        Array.isArray(structuralDesign.create.cadFiles.create)
      ) {
        structData.cadFiles = {
          create: structuralDesign.create.cadFiles.create.map((file: any) => ({
            name: file.name,
            url: file.url,
            type: "CAD",
          })),
        };
      }

      designData.structuralDesign = { create: structData };
    }

    // Handle billOfQuantities - FIXED for relation structure
    if (billOfQuantities && billOfQuantities.create) {
      const boqData: any = {
        type: "BILL_OF_QUANTITIES",
        description: billOfQuantities.create.description || "",
        overview: billOfQuantities.create.overview || "",
      };

      if (
        billOfQuantities.create.excelFiles &&
        billOfQuantities.create.excelFiles.create &&
        Array.isArray(billOfQuantities.create.excelFiles.create)
      ) {
        boqData.excelFiles = {
          create: billOfQuantities.create.excelFiles.create.map(
            (file: any) => ({
              name: file.name,
              url: file.url,
              type: "EXCEL",
            })
          ),
        };
      }

      designData.billOfQuantities = { create: boqData };
    }

    console.log(
      "Creating design with data:",
      JSON.stringify(designData, null, 2)
    );

    const newDesign = await prisma.design.create({
      data: designData,
      include: {
        category: true,
        images: true,
        floorPlans: true,
        architecturalDesign: {
          include: { pdfFiles: true, cadFiles: true },
        },
        structuralDesign: {
          include: { pdfFiles: true, cadFiles: true },
        },
        billOfQuantities: {
          include: { excelFiles: true },
        },
        packageOptions: {
          include: { file: true },
        },
      },
    });

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/admin/designs");
    revalidatePath("/designs");

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);

    // More detailed error response
    if (error instanceof Error) {
      return new NextResponse(`Internal Server Error: ${error.message}`, {
        status: 500,
      });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
