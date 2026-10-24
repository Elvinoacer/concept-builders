import { cache } from "react";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

// Share the same cached record between metadata and page rendering.
export const getPublicDesignDetail = cache(async (id: string) => {
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
  return getCachedDesign(id);
});
