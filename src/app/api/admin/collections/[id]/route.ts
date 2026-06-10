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

function parseUpdate(body: CollectionPayload) {
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title || title.length > 100) return { error: "Title is required and must be 100 characters or fewer." } as const;
    data.title = title;
  }
  if (body.subtitle !== undefined) data.subtitle = typeof body.subtitle === "string" && body.subtitle.trim() ? body.subtitle.trim() : null;
  if (body.description !== undefined) {
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!description || description.length > 500) return { error: "Description is required and must be 500 characters or fewer." } as const;
    data.description = description;
  }
  if (body.image !== undefined) {
    const image = typeof body.image === "string" ? body.image.trim() : "";
    try {
      new URL(image);
    } catch {
      return { error: "A valid image URL is required." } as const;
    }
    data.image = image;
  }
  if (body.categoryId !== undefined) data.categoryId = typeof body.categoryId === "string" && body.categoryId.trim() ? body.categoryId.trim() : null;
  if (body.order !== undefined) {
    const order = Number(body.order);
    if (!Number.isInteger(order) || order < 0) return { error: "Display order must be an integer greater than or equal to 0." } as const;
    data.order = order;
  }
  if (body.active !== undefined) data.active = Boolean(body.active);
  return { data } as const;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;
    const collection = await prisma.designCollection.findUnique({ where: { id }, include: { category: true } });
    if (!collection) return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    return NextResponse.json(collection, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;
    const parsed = parseUpdate(await request.json());
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const collection = await prisma.designCollection.update({ where: { id }, data: parsed.data, include: { category: true } });
    revalidateTag("landing-data", "max");
    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.designCollection.delete({ where: { id } });
    revalidateTag("landing-data", "max");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
