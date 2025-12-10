import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === "ADMIN";

    if (!isAdmin) {
      const sanitizeFileUrls = (files: any[]) => {
        if (files) {
          files.forEach((file) => {
            if (file) {
              (file as any).url = null;
            }
          });
        }
      };

      designs.forEach((design: any) => {
        sanitizeFileUrls(design.files);
        if (design.architecturalDesign) {
          sanitizeFileUrls(design.architecturalDesign.pdfFiles);
          sanitizeFileUrls(design.architecturalDesign.cadFiles);
        }
        if (design.structuralDesign) {
          sanitizeFileUrls(design.structuralDesign.pdfFiles);
          sanitizeFileUrls(design.structuralDesign.cadFiles);
        }
        if (design.billOfQuantities) {
          sanitizeFileUrls(design.billOfQuantities.excelFiles);
        }
      });
    }

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
      folderId,
      architecturalPdfPrice,
      architecturalCadPrice,
      structuralPdfPrice,
      structuralCadPrice,
      billOfQuantitiesPrice,
      billOfQuantitiesPdfPrice,
      packageOptions,
      images,
      floorPlans,
      files,
      architecturalDesign,
      structuralDesign,
      billOfQuantities,
    } = body;

    if (!name || !description || !categoryId || !basePrice) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    // Frontend sends { create: [...] } for images, check if that exists and has items
    if (!images || !images.create || images.create.length === 0) {
        return new NextResponse("At least one image is required.", { status: 400 });
    }

    // Auto-calculate priceRange if not provided
    const calculatedPriceRange = priceRange || `${basePrice} - ${basePrice}`;

    const designData: any = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      priceRange: calculatedPriceRange,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area: area ? parseFloat(area) : null,
      floors: floors ? parseInt(floors) : null,
      categoryId,
      folderId: folderId || null,
      architecturalPdfPrice: architecturalPdfPrice ? parseFloat(architecturalPdfPrice) : null,
      architecturalCadPrice: architecturalCadPrice ? parseFloat(architecturalCadPrice) : null,
      structuralPdfPrice: structuralPdfPrice ? parseFloat(structuralPdfPrice) : null,
      structuralCadPrice: structuralCadPrice ? parseFloat(structuralCadPrice) : null,
      billOfQuantitiesPrice: billOfQuantitiesPrice ? parseFloat(billOfQuantitiesPrice) : null,
      billOfQuantitiesPdfPrice: billOfQuantitiesPdfPrice ? parseFloat(billOfQuantitiesPdfPrice) : null,
      
      // Use create for images as sent by frontend
      images: { create: images.create },
    };

    if (floorPlans?.create?.length > 0) {
      designData.floorPlans = { create: floorPlans.create };
    }

    if (files?.create?.length > 0) {
      designData.files = { create: files.create };
    }

    if (packageOptions?.create?.length > 0) {
      designData.packageOptions = {
        create: packageOptions.create.map((pkg: any) => ({
          name: pkg.name,
          price: parseFloat(pkg.price),
          // Handle nested file creation for package options if present
          ...(pkg.file?.create && { 
            file: { 
              create: {
                name: pkg.file.create.name,
                url: pkg.file.create.url,
                type: pkg.file.create.type
              } 
            } 
          }),
        })),
      };
    }

    const handleDesignDocument = (doc: any) => {
        if (!doc?.create) return undefined;
        const { type, pdfFiles, cadFiles, excelFiles } = doc.create;
        const createData: any = { type };
        
        // These are also sent as { create: [...] } from frontend helper fileListPayload
        if (pdfFiles?.create?.length > 0) {
            createData.pdfFiles = { create: pdfFiles.create };
        }
        if (cadFiles?.create?.length > 0) {
            createData.cadFiles = { create: cadFiles.create };
        }
        if (excelFiles?.create?.length > 0) {
            createData.excelFiles = { create: excelFiles.create };
        }

        // Only add if we have at least one file type or it's just a container (though usually we want files)
        // The frontend sends empty arrays if no files, so we should check if we actually have content to create
        // But the structure requires the document type to exist if we are creating it.
        return { create: createData };
    };

    const ad = handleDesignDocument(architecturalDesign);
    if (ad) designData.architecturalDesign = ad;

    const sd = handleDesignDocument(structuralDesign);
    if (sd) designData.structuralDesign = sd;

    const bq = handleDesignDocument(billOfQuantities);
    if (bq) designData.billOfQuantities = bq;

    const newDesign = await prisma.design.create({
      data: designData,
      include: {
        category: true,
        images: true,
        floorPlans: true,
        files: true,
        architecturalDesign: { include: { pdfFiles: true, cadFiles: true } },
        structuralDesign: { include: { pdfFiles: true, cadFiles: true } },
        billOfQuantities: { include: { excelFiles: true, pdfFiles: true } },
        packageOptions: { include: { file: true } },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/designs");
    revalidatePath("/designs");

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    if (error instanceof Error) {
      const message = error.message || "An unexpected error occurred.";
      // Look for Prisma-specific errors
      if ((error as any).code) {
         console.error("Prisma error code:", (error as any).code);
         console.error("Prisma error meta:", (error as any).meta);
      }
      return new NextResponse(`Internal Server Error: ${message}`, { status: 500 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
