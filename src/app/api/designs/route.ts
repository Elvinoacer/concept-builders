import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

type FindManyArgs = NonNullable<Parameters<typeof prisma.design.findMany>[0]>;
type DesignWhere = NonNullable<FindManyArgs["where"]>;
type DesignOrderBy = NonNullable<FindManyArgs["orderBy"]>;
type CreateArgs = NonNullable<Parameters<typeof prisma.design.create>[0]>;
type DesignCreateData = CreateArgs["data"];

type FilePayload = {
  name: string;
  url: string;
  type: string;
  originalFileName?: string;
};

type FileListCreatePayload = {
  create?: FilePayload[];
};

type PackageOptionPayload = {
  name: string;
  price: string | number;
  file?: {
    create?: FilePayload;
  };
};

type DesignDocumentPayload = {
  type?: string;
  pdfFiles?: FilePayload[];
  cadFiles?: FilePayload[];
  excelFiles?: FilePayload[];
  create?: {
    type: string;
    pdfFiles?: FileListCreatePayload;
    cadFiles?: FileListCreatePayload;
    excelFiles?: FileListCreatePayload;
  };
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === "ADMIN";

    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get("search") || "").trim();
    const cursor = searchParams.get("cursor");
    const mode = searchParams.get("mode");
    const lite = searchParams.get("lite") === "true";
    const includeTotals = searchParams.get("includeTotals") !== "false";
    const useCursorPagination =
      !isAdmin &&
      (mode === "cursor" || Boolean(cursor) || !searchParams.has("page"));

    const maxLimit = lite ? 200 : 50;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      maxLimit,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
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

    const where: DesignWhere = {};

    if (search) {
      const ftsMatches = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT "id"
        FROM "public"."Design"
        WHERE "search_vector" @@ plainto_tsquery('english', ${search})
        ORDER BY ts_rank("search_vector", plainto_tsquery('english', ${search})) DESC
        LIMIT 2000
      `;

      const matchedIds = ftsMatches.map((row) => row.id);
      if (matchedIds.length === 0) {
        return NextResponse.json(
          useCursorPagination
            ? {
                designs: [],
                nextCursor: null,
                hasMore: false,
              }
            : {
                designs: [],
                totalPages: 0,
                totalDesigns: 0,
              },
          {
            headers: {
              "Cache-Control": isAdmin
                ? "private, no-store"
                : "public, s-maxage=60, stale-while-revalidate=300",
            },
          },
        );
      }

      where.id = { in: matchedIds };
    }

    if (priceType === "design" && (minPrice || maxPrice)) {
      const basePriceFilter: Record<string, number> = {};
      if (minPrice) basePriceFilter.gte = parseFloat(minPrice);
      if (maxPrice) basePriceFilter.lte = parseFloat(maxPrice);
      (where as Record<string, unknown>).basePrice = basePriceFilter;
    } else if (priceType === "building" && (minPrice || maxPrice)) {
      const minBuildingCostFilter: Record<string, number> = {};
      if (minPrice) minBuildingCostFilter.gte = parseFloat(minPrice);
      (where as Record<string, unknown>).minBuildingCost =
        minBuildingCostFilter;
      if (maxPrice) {
        (where as Record<string, unknown>).maxBuildingCost = {
          lte: parseFloat(maxPrice),
        };
      }
    }

    if (bedrooms) {
      if (bedrooms === "4+") {
        where.bedrooms = { gte: 4 };
      } else {
        where.bedrooms = parseInt(bedrooms);
      }
    }

    if (styles && styles.length > 0) {
      where.category = {
        name: {
          in: styles,
        },
      };
    }

    if (minSize || maxSize) {
      const areaFilter: Record<string, number> = {};
      if (minSize) areaFilter.gte = parseFloat(minSize);
      if (maxSize) areaFilter.lte = parseFloat(maxSize);
      (where as Record<string, unknown>).area = areaFilter;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (exclude) {
      if (where.id && typeof where.id === "object" && "in" in where.id) {
        const existing = where.id.in as string[];
        where.id = { in: existing.filter((id) => id !== exclude) };
      } else {
        where.id = { not: exclude };
      }
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    let orderBy: DesignOrderBy = {
      createdAt: "desc",
    };
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

    const publicSelect: NonNullable<FindManyArgs["select"]> = lite
      ? {
          id: true,
          name: true,
          basePrice: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          floors: true,
          isFeatured: true,
          views: true,
          category: { select: { id: true, name: true } },
          images: {
            where: { type: "IMAGE" },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              url: true,
              name: true,
              type: true,
            },
          },
          files: {
            where: { type: "IMAGE" },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              url: true,
              name: true,
              type: true,
            },
          },
        }
      : {
          id: true,
          name: true,
          description: true,
          basePrice: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          floors: true,
          isFeatured: true,
          createdAt: true,
          updatedAt: true,
          views: true,
          category: { select: { id: true, name: true } },
          images: {
            where: { type: "IMAGE" },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              url: true,
              name: true,
              type: true,
            },
          },
          files: {
            where: { type: "IMAGE" },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              url: true,
              name: true,
              type: true,
            },
          },
          discounts: {
            select: {
              discount: {
                select: { value: true, code: true, isActive: true },
              },
            },
          },
        };

    if (!isAdmin && useCursorPagination) {
      const designs = await prisma.design.findMany({
        where,
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: publicSelect,
        orderBy,
      });

      const hasMore = designs.length > limit;
      const items = hasMore ? designs.slice(0, -1) : designs;
      const nextCursor = hasMore ? items[items.length - 1].id : null;

      return NextResponse.json(
        {
          designs: items,
          nextCursor,
          hasMore,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        },
      );
    }

    if (isAdmin && lite) {
      if (!includeTotals) {
        const designs = await prisma.design.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            basePrice: true,
            isFeatured: true,
          },
          orderBy,
        });

        return NextResponse.json(
          {
            designs,
            totalPages: null,
            totalDesigns: null,
          },
          {
            headers: {
              "Cache-Control": "private, no-store",
            },
          },
        );
      }

      const [designs, totalDesigns] = await prisma.$transaction([
        prisma.design.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            basePrice: true,
            isFeatured: true,
          },
          orderBy,
        }),
        prisma.design.count({ where }),
      ]);

      return NextResponse.json(
        {
          designs,
          totalPages: Math.ceil(totalDesigns / limit),
          totalDesigns,
        },
        {
          headers: {
            "Cache-Control": "private, no-store",
          },
        },
      );
    }

    if (!isAdmin && !includeTotals) {
      const designs = await prisma.design.findMany({
        where,
        skip,
        take: limit,
        select: publicSelect,
        orderBy,
      });

      return NextResponse.json(
        {
          designs,
          totalPages: null,
          totalDesigns: null,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        },
      );
    }

    const [designs, totalDesigns] = isAdmin
      ? await prisma.$transaction([
          prisma.design.findMany({
            where,
            skip,
            take: limit,
            include: {
              images: true,
              files: true,
              reviews: true,
              category: true,
              floorPlans: true,
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
          }),
          prisma.design.count({ where }),
        ])
      : await prisma.$transaction([
          prisma.design.findMany({
            where,
            skip,
            take: limit,
            select: publicSelect,
            orderBy,
          }),
          prisma.design.count({ where }),
        ]);

    return NextResponse.json(
      {
        designs,
        totalPages: Math.ceil(totalDesigns / limit),
        totalDesigns,
      },
      {
        headers: {
          "Cache-Control": isAdmin
            ? "private, no-store"
            : "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching designs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
      return new NextResponse("At least one image is required.", {
        status: 400,
      });
    }

    // Auto-calculate priceRange if not provided
    const calculatedPriceRange = priceRange || `${basePrice} - ${basePrice}`;

    const designData: Record<string, unknown> = {
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
      billOfQuantitiesPdfPrice: billOfQuantitiesPdfPrice
        ? parseFloat(billOfQuantitiesPdfPrice)
        : null,

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
        create: (packageOptions.create as PackageOptionPayload[]).map(
          (pkg) => ({
            name: pkg.name,
            price:
              typeof pkg.price === "number" ? pkg.price : parseFloat(pkg.price),
            // Handle nested file creation for package options if present
            ...(pkg.file?.create && {
              file: {
                create: {
                  name: pkg.file.create.name,
                  url: pkg.file.create.url,
                  type: pkg.file.create.type,
                },
              },
            }),
          }),
        ),
      };
    }

    const handleDesignDocument = (
      doc: DesignDocumentPayload | undefined,
      fallbackType: "ARCHITECTURAL" | "STRUCTURAL" | "BILL_OF_QUANTITIES",
    ) => {
      if (!doc) return undefined;

      const type = doc.create?.type || doc.type || fallbackType;
      const pdfFiles = doc.create?.pdfFiles?.create || doc.pdfFiles || [];
      const cadFiles = doc.create?.cadFiles?.create || doc.cadFiles || [];
      const excelFiles = doc.create?.excelFiles?.create || doc.excelFiles || [];

      const createData: Record<string, unknown> = { type };

      if (pdfFiles.length > 0) {
        createData.pdfFiles = { create: pdfFiles };
      }
      if (cadFiles.length > 0) {
        createData.cadFiles = { create: cadFiles };
      }
      if (excelFiles.length > 0) {
        createData.excelFiles = { create: excelFiles };
      }

      if (
        pdfFiles.length === 0 &&
        cadFiles.length === 0 &&
        excelFiles.length === 0
      ) {
        return undefined;
      }

      return { create: createData };
    };

    const ad = handleDesignDocument(architecturalDesign, "ARCHITECTURAL");
    if (ad) designData.architecturalDesign = ad;

    const sd = handleDesignDocument(structuralDesign, "STRUCTURAL");
    if (sd) designData.structuralDesign = sd;

    const bq = handleDesignDocument(billOfQuantities, "BILL_OF_QUANTITIES");
    if (bq) designData.billOfQuantities = bq;

    const newDesign = await prisma.design.create({
      data: designData as DesignCreateData,
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

    revalidateTag("designs", "max");
    revalidateTag("featured-designs", "max");

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    if (error instanceof Error) {
      const message = error.message || "An unexpected error occurred.";
      // Look for Prisma-specific errors
      const maybePrismaError = error as { code?: unknown; meta?: unknown };
      if (maybePrismaError.code) {
        console.error("Prisma error code:", maybePrismaError.code);
        console.error("Prisma error meta:", maybePrismaError.meta);
      }
      return new NextResponse(`Internal Server Error: ${message}`, {
        status: 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
