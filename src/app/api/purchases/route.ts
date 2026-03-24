import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const sortOrder = searchParams.get("sortOrder") || "date_desc";
  const filterFileType = searchParams.get("filterFileType") || "all";

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            design: {
              include: {
                images: true, // Include images
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
            },
          },
        },
      },
    });

    let purchasedDesigns = orders.flatMap((order) =>
      order.items.map((item) => {
        const purchasedFiles: Array<{
          id: string;
          name: string;
          url: string;
          type: string;
        }> = [];
        const selectedTypes = item.selectedFileTypes || [];

        if (selectedTypes.includes("architecturalPdf")) {
          purchasedFiles.push(
            ...(item.design.architecturalDesign?.pdfFiles || []),
          );
        }
        if (selectedTypes.includes("architecturalCad")) {
          purchasedFiles.push(
            ...(item.design.architecturalDesign?.cadFiles || []),
          );
        }
        if (selectedTypes.includes("structuralPdf")) {
          purchasedFiles.push(
            ...(item.design.structuralDesign?.pdfFiles || []),
          );
        }
        if (selectedTypes.includes("structuralCad")) {
          purchasedFiles.push(
            ...(item.design.structuralDesign?.cadFiles || []),
          );
        }
        if (selectedTypes.includes("billOfQuantitiesExcel")) {
          purchasedFiles.push(
            ...(item.design.billOfQuantities?.excelFiles || []),
          );
        }
        if (selectedTypes.includes("billOfQuantitiesPdf")) {
          purchasedFiles.push(
            ...(item.design.billOfQuantities?.pdfFiles || []),
          );
        }

        const extras = Array.isArray(item.selectedExtras)
          ? (item.selectedExtras as Array<{
              id?: string;
              packageOptionId?: string;
            }>)
          : [];

        for (const extra of extras) {
          const optionId = extra.id || extra.packageOptionId;
          if (!optionId) continue;

          const packageOption = item.design.packageOptions.find(
            (po) => po.id === optionId,
          );
          if (packageOption?.file) {
            purchasedFiles.push(packageOption.file);
          }
        }

        const uniquePurchasedFiles = Array.from(
          new Map(purchasedFiles.map((file) => [file.id, file])).values(),
        );

        return {
          ...item.design,
          orderId: order.id,
          createdAt: order.createdAt,
          selectedFileTypes: item.selectedFileTypes,
          selectedExtras: item.selectedExtras,
          purchasedFiles: uniquePurchasedFiles,
        };
      }),
    );

    // Apply filtering
    if (filterFileType && filterFileType !== "all") {
      purchasedDesigns = purchasedDesigns.filter((design) => {
        if (Array.isArray(design.selectedFileTypes)) {
          if (filterFileType === "PDF") {
            return design.selectedFileTypes.includes("architecturalPdf");
          } else if (filterFileType === "PDF & CAD") {
            return (
              design.selectedFileTypes.includes("architecturalPdf") &&
              design.selectedFileTypes.includes("architecturalCad")
            );
          }
        }
        return false;
      });
    }

    // Apply sorting
    if (sortOrder) {
      purchasedDesigns.sort((a, b) => {
        switch (sortOrder) {
          case "date_asc":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "date_desc":
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });
    }

    return NextResponse.json(purchasedDesigns);
  } catch (error) {
    console.error("Error fetching purchased designs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
