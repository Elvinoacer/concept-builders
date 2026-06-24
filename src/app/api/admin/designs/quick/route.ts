import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";
import { FileType } from "@/generated/prisma/client";

/**
 * POST /api/admin/designs/quick
 *
 * Lightweight endpoint for quick bulk design creation.
 * Creates a Design with minimal metadata and linked image File records.
 *
 * Body:
 * {
 *   name: string;
 *   categoryId: string;
 *   imageUrls: string[];            // CDN URLs of already-uploaded images
 *   description?: string;           // optional override
 * }
 */
export async function POST(req: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const body = await req.json();
    const { name, categoryId, imageUrls, description } = body;

    // ── Validation ──────────────────────────────────────────────────────
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Design name is required" },
        { status: 400 },
      );
    }

    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image URL is required" },
        { status: 400 },
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // ── Auto-generate description if not provided ───────────────────────
    const designDescription =
      description?.trim() ||
      `A stunning architectural design: ${name.trim()}. Browse through ${imageUrls.length} high-quality render${imageUrls.length > 1 ? "s" : ""} showcasing this design from multiple perspectives.`;

    // ── Derive a human-readable name from each image URL ────────────────
    const imageNameFromUrl = (url: string): string => {
      try {
        const filename = decodeURIComponent(url.split("/").pop() || "image");
        return filename.replace(/\.(jpg|jpeg|png|webp|avif|gif)$/i, "");
      } catch {
        return "image";
      }
    };

    // ── Create Design + File records in a single Prisma call ────────────
    const design = await prisma.design.create({
      data: {
        name: name.trim(),
        description: designDescription,
        basePrice: 0,
        priceRange: "Contact for pricing",
        categoryId,
        planDetails: [],
        buildingCostEstimates: [],
        faq: [],
        images: {
          create: imageUrls.map((url: string) => ({
            name: imageNameFromUrl(url),
            url,
            type: FileType.IMAGE,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    // ── Cache invalidation ──────────────────────────────────────────────
    try {
      revalidateTag("designs");
      revalidateTag("featured-designs");
    } catch {
      // revalidateTag may throw in some environments; non-critical
    }

    return NextResponse.json(design, { status: 201 });
  } catch (err) {
    console.error("[quick-design] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create design";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
