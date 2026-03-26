import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
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

  const getCachedDesign = unstable_cache(
    async (designId: string) =>
      prisma.design.findUnique({
        where: { id: designId },
        select: {
          id: true,
          name: true,
          description: true,
          basePrice: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          floors: true,
          views: true,
          categoryId: true,
          planDetails: true,
          isFeatured: true,
          faq: true,
          architecturalPdfPrice: true,
          architecturalCadPrice: true,
          structuralPdfPrice: true,
          structuralCadPrice: true,
          billOfQuantitiesPrice: true,
          billOfQuantitiesPdfPrice: true,
          images: {
            select: {
              id: true,
              url: true,
              name: true,
              type: true,
            },
          },
          floorPlans: {
            select: {
              id: true,
              url: true,
              name: true,
              type: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          architecturalDesign: {
            select: {
              pdfFiles: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
              cadFiles: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
          structuralDesign: {
            select: {
              pdfFiles: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
              cadFiles: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
          billOfQuantities: {
            select: {
              excelFiles: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
              pdfFiles: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
          packageOptions: {
            select: {
              id: true,
              name: true,
              price: true,
              file: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      }),
    [`design-detail-${id}`],
    { revalidate: 120, tags: ["designs", `design-${id}`] },
  );

  const design = await getCachedDesign(id);

  if (!design) {
    notFound();
  }

  sanitizePrivateFileUrls(design);

  const related = design.categoryId
    ? await unstable_cache(
        async () =>
          prisma.design.findMany({
            where: {
              categoryId: design.categoryId,
              id: { not: design.id },
            },
            take: 3,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              basePrice: true,
              category: { select: { name: true } },
              images: {
                where: { type: "IMAGE" },
                take: 1,
                select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                },
              },
            },
          }),
        [`design-related-${id}`],
        { revalidate: 120, tags: ["designs", `design-${id}`] },
      )()
    : [];

  return (
    <DesignDetailClient
      designId={id}
      initialDesign={design as unknown as DesignDetailPayload}
      initialRelated={related as unknown as RelatedDesignPayload[]}
    />
  );
}
