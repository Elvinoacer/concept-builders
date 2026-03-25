import { notFound } from "next/navigation";

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
  files: Array<{ url: string | null }>;
  architecturalDesign: {
    pdfFiles: Array<{ url: string | null }>;
    cadFiles: Array<{ url: string | null }>;
  } | null;
  structuralDesign: {
    pdfFiles: Array<{ url: string | null }>;
    cadFiles: Array<{ url: string | null }>;
  } | null;
  billOfQuantities: {
    excelFiles: Array<{ url: string | null }>;
    pdfFiles: Array<{ url: string | null }>;
  } | null;
  packageOptions: Array<{ file: { url: string | null } | null }>;
}) => {
  const clear = (files: Array<{ url: string | null }> | undefined) => {
    if (!files) return;
    files.forEach((file) => {
      file.url = null;
    });
  };

  clear(design.files);
  clear(design.architecturalDesign?.pdfFiles);
  clear(design.architecturalDesign?.cadFiles);
  clear(design.structuralDesign?.pdfFiles);
  clear(design.structuralDesign?.cadFiles);
  clear(design.billOfQuantities?.excelFiles);
  clear(design.billOfQuantities?.pdfFiles);

  design.packageOptions.forEach((option) => {
    if (option.file) {
      option.file.url = null;
    }
  });
};

export default async function DesignDetailPage({
  params,
}: DesignDetailPageProps) {
  const { id } = await params;

  const design = await prisma.design.findUnique({
    where: { id },
    include: {
      files: true,
      images: true,
      floorPlans: true,
      reviews: {
        include: {
          author: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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
          pdfFiles: true,
        },
      },
      packageOptions: {
        include: {
          file: true,
        },
      },
    },
  });

  if (!design) {
    notFound();
  }

  sanitizePrivateFileUrls(design);

  const related = design.categoryId
    ? await prisma.design.findMany({
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
      })
    : [];

  return (
    <DesignDetailClient
      designId={id}
      initialDesign={design as unknown as DesignDetailPayload}
      initialRelated={related as unknown as RelatedDesignPayload[]}
    />
  );
}
