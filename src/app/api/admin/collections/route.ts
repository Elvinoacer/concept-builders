import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

type CollectionPayload = {
  title?: unknown;
  subtitle?: unknown;
  description?: unknown;
  image?: unknown;
  categoryId?: unknown;
  order?: unknown;
  active?: unknown;
};

function parsePayload(body: CollectionPayload) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const subtitle = typeof body.subtitle === "string" ? body.subtitle.trim() : null;
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const categoryId = typeof body.categoryId === "string" && body.categoryId.trim() ? body.categoryId.trim() : null;
  const order = Number(body.order ?? 0);
  const active = typeof body.active === "boolean" ? body.active : true;

  if (!title || title.length > 100) return { error: "Title is required and must be 100 characters or fewer." } as const;
  if (!description || description.length > 500) return { error: "Description is required and must be 500 characters or fewer." } as const;
  try {
    new URL(image);
  } catch {
    return { error: "A valid image URL is required." } as const;
  }
  if (!Number.isInteger(order) || order < 0) return { error: "Display order must be an integer greater than or equal to 0." } as const;

  return { data: { title, subtitle, description, image, categoryId, order, active } } as const;
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const search = request.nextUrl.searchParams.get("search")?.trim() || "";
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { subtitle: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [collections, totalCollections, categories] = await prisma.$transaction([
      prisma.designCollection.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.designCollection.count({ where }),
      prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    ]);

    return NextResponse.json({ collections, categories, totalPages: Math.ceil(totalCollections / limit), totalCollections }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const parsed = parsePayload(await request.json());
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const collection = await prisma.designCollection.create({
      data: parsed.data,
      include: { category: true },
    });

    revalidateTag("landing-data", "max");
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
