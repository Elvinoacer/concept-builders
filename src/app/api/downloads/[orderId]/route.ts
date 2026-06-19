import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrlForFiles } from "@/lib/r2-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isPrivileged =
    session.user.role === "ADMIN" || session.user.role === "TEAM";

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(isPrivileged ? {} : { userId: session.user.id }),
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
            deliveredFiles: {
              include: {
                file: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const urls = new Set<string>();

    for (const item of order.items) {
      // If admin manually delivered specific files, honor those first.
      for (const delivered of item.deliveredFiles) {
        if (delivered.file?.url) {
          urls.add(delivered.file.url);
        }
      }

      const selectedTypes = item.selectedFileTypes || [];

      if (selectedTypes.includes("architecturalPdf")) {
        item.design.architecturalDesign?.pdfFiles.forEach((file) => {
          if (file.url) urls.add(file.url);
        });
      }
      if (selectedTypes.includes("architecturalCad")) {
        item.design.architecturalDesign?.cadFiles.forEach((file) => {
          if (file.url) urls.add(file.url);
        });
      }
      if (selectedTypes.includes("structuralPdf")) {
        item.design.structuralDesign?.pdfFiles.forEach((file) => {
          if (file.url) urls.add(file.url);
        });
      }
      if (selectedTypes.includes("structuralCad")) {
        item.design.structuralDesign?.cadFiles.forEach((file) => {
          if (file.url) urls.add(file.url);
        });
      }
      if (selectedTypes.includes("billOfQuantitiesExcel")) {
        item.design.billOfQuantities?.excelFiles.forEach((file) => {
          if (file.url) urls.add(file.url);
        });
      }
      if (selectedTypes.includes("billOfQuantitiesPdf")) {
        item.design.billOfQuantities?.pdfFiles.forEach((file) => {
          if (file.url) urls.add(file.url);
        });
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

        const option = item.design.packageOptions.find(
          (p) => p.id === optionId,
        );
        if (option?.file?.url) {
          urls.add(option.file.url);
        }
      }
    }

    const filesToSign = Array.from(urls);
    if (filesToSign.length === 0) {
      return NextResponse.json([]);
    }

    const signedUrls = await getSignedUrlForFiles(filesToSign);

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    await prisma.downloadLog.createMany({
      data: filesToSign.map((fileUrl) => ({
        userId: session.user.id,
        orderId,
        fileUrl,
        ipAddress,
      })),
    });

    return NextResponse.json(signedUrls);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
