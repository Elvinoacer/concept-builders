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
  const sortOrder = searchParams.get('sortOrder') || 'date_desc';
  const filterFileType = searchParams.get('filterFileType') || 'all';

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
            },
          },
        },
      },
    });

    let purchasedDesigns = orders.flatMap(order => 
      order.items.map(item => {
        const purchasedFiles = [];

        if (item.selectedFileTypes.includes('architecturalPdf') && item.design.architecturalDesign) {
          purchasedFiles.push(...item.design.architecturalDesign.pdfFiles);
        }
        if (item.selectedFileTypes.includes('architecturalCad') && item.design.architecturalDesign) {
          purchasedFiles.push(...item.design.architecturalDesign.cadFiles);
        }
        if (item.selectedFileTypes.includes('structuralPdf') && item.design.structuralDesign) {
          purchasedFiles.push(...item.design.structuralDesign.pdfFiles);
        }
        if (item.selectedFileTypes.includes('structuralCad') && item.design.structuralDesign) {
          purchasedFiles.push(...item.design.structuralDesign.cadFiles);
        }
        if (item.selectedFileTypes.includes('billOfQuantities') && item.design.billOfQuantities) {
          purchasedFiles.push(...item.design.billOfQuantities.excelFiles);
        }

        if (item.selectedExtras) {
          const extras = typeof item.selectedExtras === 'string' ? JSON.parse(item.selectedExtras) : item.selectedExtras;
          extras.forEach(extra => {
            if (extra.file) {
              purchasedFiles.push(extra.file);
            }
          });
        }

        return {
          ...item.design, 
          createdAt: order.createdAt, 
          selectedFileTypes: item.selectedFileTypes, 
          selectedExtras: item.selectedExtras,
          purchasedFiles,
        }
      })
    );

    // Apply filtering
    if (filterFileType && filterFileType !== 'all') {
      purchasedDesigns = purchasedDesigns.filter(design => {
        if (Array.isArray(design.selectedFileTypes)) {
          if (filterFileType === 'PDF') {
            return design.selectedFileTypes.includes('architecturalPdf');
          } else if (filterFileType === 'PDF & CAD') {
            return design.selectedFileTypes.includes('architecturalPdf') && design.selectedFileTypes.includes('architecturalCad');
          }
        }
        return false;
      });
    }

    // Apply sorting
    if (sortOrder) {
      purchasedDesigns.sort((a, b) => {
        switch (sortOrder) {
          case 'date_asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'date_desc':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
    }

    return NextResponse.json(purchasedDesigns);
  } catch (error) {
    console.error("Error fetching purchased designs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
