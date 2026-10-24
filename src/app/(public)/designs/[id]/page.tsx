import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
import { getPublicDesignDetail } from "@/lib/public-design-detail";
import DesignDetailClient from "./DesignDetailClient";
import type {
  DesignDetailPayload,
  RelatedDesignPayload,
} from "./DesignDetailClient";

interface DesignDetailPageProps {
  params: Promise<{ id: string }>;
}

const sanitizePrivateFileUrls = (design: {
  architecturalDesign?: {
    pdfFiles?: Array<{ url: string | null }>;
    cadFiles?: Array<{ url: string | null }>;
  } | null;
  structuralDesign?: {
    pdfFiles?: Array<{ url: string | null }>;
    cadFiles?: Array<{ url: string | null }>;
  } | null;
  billOfQuantities?: {
    excelFiles?: Array<{ url: string | null }>;
    pdfFiles?: Array<{ url: string | null }>;
  } | null;
  packageOptions?: Array<{ file?: { url: string | null } | null }>;
}) => {
  const clear = (files: Array<{ url: string | null }> | undefined) => {
    if (!files) return;
    files.forEach((file) => {
      file.url = null;
    });
  };

  clear(design.architecturalDesign?.pdfFiles);
  clear(design.architecturalDesign?.cadFiles);
  clear(design.structuralDesign?.pdfFiles);
  clear(design.structuralDesign?.cadFiles);
  clear(design.billOfQuantities?.excelFiles);
  clear(design.billOfQuantities?.pdfFiles);

  (design.packageOptions || []).forEach((option) => {
    if (option.file) {
      option.file.url = null;
    }
  });
};

export default async function DesignDetailPage({
  params,
}: DesignDetailPageProps) {
  const { id } = await params;

  const record = await getPublicDesignDetail(id);

  if (!record) {
    notFound();
  }

  const design = structuredClone(record);
  sanitizePrivateFileUrls(design);

  const relatedSelect = {
    id: true,
    name: true,
    basePrice: true,
    bedrooms: true,
    bathrooms: true,
    area: true,
    category: { select: { name: true } },
    images: {
      where: { type: "IMAGE" as const },
      take: 4,
      orderBy: { createdAt: "desc" as const },
      select: {
        id: true,
        url: true,
        name: true,
        type: true,
      },
    },
  };

  const relatedPromise = design.categoryId
    ? unstable_cache(
        async () =>
          prisma.design.findMany({
            where: {
              categoryId: design.categoryId,
              id: { not: design.id },
            },
            take: 12,
            orderBy: [{ views: "desc" }, { createdAt: "desc" }],
            select: relatedSelect,
          }),
        [`design-related-v2-${id}`],
        { revalidate: 120, tags: ["designs", `design-${id}`] },
      )()
    : Promise.resolve([]);

  // Prev/next neighbors in the same category (by name) for continuous inspiration
  const neighborsPromise = design.categoryId
    ? unstable_cache(
        async () => {
          const [prev, next] = await Promise.all([
            prisma.design.findFirst({
              where: {
                categoryId: design.categoryId,
                name: { lt: design.name },
              },
              orderBy: { name: "desc" },
              select: { id: true, name: true },
            }),
            prisma.design.findFirst({
              where: {
                categoryId: design.categoryId,
                name: { gt: design.name },
              },
              orderBy: { name: "asc" },
              select: { id: true, name: true },
            }),
          ]);

          // Wrap around category edges so browsing never dead-ends
          const [first, last] = await Promise.all([
            !prev
              ? prisma.design.findFirst({
                  where: {
                    categoryId: design.categoryId,
                    id: { not: design.id },
                  },
                  orderBy: { name: "desc" },
                  select: { id: true, name: true },
                })
              : Promise.resolve(null),
            !next
              ? prisma.design.findFirst({
                  where: {
                    categoryId: design.categoryId,
                    id: { not: design.id },
                  },
                  orderBy: { name: "asc" },
                  select: { id: true, name: true },
                })
              : Promise.resolve(null),
          ]);

          return {
            prev: prev ?? first,
            next: next ?? last,
          };
        },
        [`design-neighbors-v1-${id}`],
        { revalidate: 120, tags: ["designs", `design-${id}`] },
      )()
    : Promise.resolve({ prev: null, next: null });

  const [related, neighbors] = await Promise.all([
    relatedPromise,
    neighborsPromise,
  ]);

  return (
    <DesignDetailClient
      // Force a fresh client tree per design so state + scroll never carry over
      key={id}
      designId={id}
      initialDesign={design as unknown as DesignDetailPayload}
      initialRelated={related as unknown as RelatedDesignPayload[]}
      initialNeighbors={neighbors}
    />
  );
}
