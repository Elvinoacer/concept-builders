import prisma from "@/lib/prisma";

const FILE_TYPE_LABELS: Record<string, string> = {
  architecturalPdf: "Architectural PDF",
  ARCHITECTURAL_PDF: "Architectural PDF",
  architecturalCad: "Architectural CAD",
  ARCHITECTURAL_CAD: "Architectural CAD",
  structuralPdf: "Structural PDF",
  STRUCTURAL_PDF: "Structural PDF",
  structuralCad: "Structural CAD",
  STRUCTURAL_CAD: "Structural CAD",
  billOfQuantitiesPdf: "Bill of Quantities PDF",
  BILL_OF_QUANTITIES_PDF: "Bill of Quantities PDF",
  billOfQuantitiesExcel: "Bill of Quantities Excel",
  BILL_OF_QUANTITIES_EXCEL: "Bill of Quantities Excel",
  billOfQuantities: "Bill of Quantities",
};

type Extra = {
  id?: string;
  packageOptionId?: string;
  name?: string;
  type?: string;
};

const normalizeExtras = (extras: unknown): Extra[] => {
  if (!extras) return [];
  if (typeof extras === "string") {
    try {
      const parsed = JSON.parse(extras);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(extras) ? (extras as Extra[]) : [];
};

const pushFileIds = (target: Set<string>, files?: Array<{ id: string }>) => {
  files?.forEach((file) => target.add(file.id));
};

export async function verifyOrderDeliverables(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          design: {
            include: {
              architecturalDesign: { include: { pdfFiles: true, cadFiles: true } },
              structuralDesign: { include: { pdfFiles: true, cadFiles: true } },
              billOfQuantities: { include: { pdfFiles: true, excelFiles: true } },
              packageOptions: { include: { file: true } },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const missingFiles: string[] = [];
  const deliveredByOrderItem = new Map<string, Set<string>>();

  for (const item of order.items) {
    const fileIds = new Set<string>();
    const design = item.design;

    for (const selectedType of item.selectedFileTypes || []) {
      const label = FILE_TYPE_LABELS[selectedType] || selectedType;
      const before = fileIds.size;

      switch (selectedType) {
        case "architecturalPdf":
        case "ARCHITECTURAL_PDF":
          pushFileIds(fileIds, design.architecturalDesign?.pdfFiles);
          break;
        case "architecturalCad":
        case "ARCHITECTURAL_CAD":
          pushFileIds(fileIds, design.architecturalDesign?.cadFiles);
          break;
        case "structuralPdf":
        case "STRUCTURAL_PDF":
          pushFileIds(fileIds, design.structuralDesign?.pdfFiles);
          break;
        case "structuralCad":
        case "STRUCTURAL_CAD":
          pushFileIds(fileIds, design.structuralDesign?.cadFiles);
          break;
        case "billOfQuantitiesPdf":
        case "BILL_OF_QUANTITIES_PDF":
          pushFileIds(fileIds, design.billOfQuantities?.pdfFiles);
          break;
        case "billOfQuantitiesExcel":
        case "BILL_OF_QUANTITIES_EXCEL":
          pushFileIds(fileIds, design.billOfQuantities?.excelFiles);
          break;
        case "billOfQuantities":
          pushFileIds(fileIds, design.billOfQuantities?.pdfFiles);
          pushFileIds(fileIds, design.billOfQuantities?.excelFiles);
          break;
      }

      if (fileIds.size === before) {
        missingFiles.push(`${design.name}: ${label}`);
      }
    }

    for (const extra of normalizeExtras(item.selectedExtras)) {
      const optionId = extra.packageOptionId || extra.id;
      if (!optionId) continue;

      const option = design.packageOptions.find((entry) => entry.id === optionId);
      if (option?.file?.id) {
        fileIds.add(option.file.id);
      } else {
        missingFiles.push(`${design.name}: ${extra.name || "Package extra"}`);
      }
    }

    deliveredByOrderItem.set(item.id, fileIds);
  }

  return {
    ready: missingFiles.length === 0,
    missingFiles,
    deliveredByOrderItem,
  };
}

export async function reconcileOrderDelivery(orderId: string) {
  const result = await verifyOrderDeliverables(orderId);

  await prisma.$transaction(async (tx) => {
    for (const [orderItemId, fileIds] of result.deliveredByOrderItem.entries()) {
      if (fileIds.size > 0) {
        await tx.deliveredFile.createMany({
          data: Array.from(fileIds).map((fileId) => ({ orderItemId, fileId })),
          skipDuplicates: true,
        });
      }

      await tx.orderItem.update({
        where: { id: orderItemId },
        data: {
          deliveryStatus: result.ready ? "READY" : "MANUAL_DELIVERY_REQUIRED",
        },
      });
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        deliveryStatus: result.ready ? "DELIVERED" : "MANUAL_REVIEW",
        missingFiles: result.missingFiles,
      },
    });
  });

  return result;
}
