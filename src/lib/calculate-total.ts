import { Design, PackageOption } from "@/generated/prisma/browser";

interface CartItem {
  quantity: number;
  selectedFileTypes: string[];
  selectedExtras?: any[];
  design: Design & { packageOptions: PackageOption[] };
}

export const calculateItemTotal = (item: CartItem): number => {
  const { design, quantity, selectedFileTypes, selectedExtras } = item;
  const normalizedQuantity = Math.min(Math.max(quantity || 1, 1), 1);

  let total = design.basePrice * normalizedQuantity;

  if (selectedFileTypes) {
    // Architectural PDF is part of the base package and should not be charged twice.
    if (selectedFileTypes.includes("architecturalCad")) {
      total += design.architecturalCadPrice || 0;
    }
    if (selectedFileTypes.includes("structuralPdf")) {
      total += design.structuralPdfPrice || 0;
    }
    if (selectedFileTypes.includes("structuralCad")) {
      total += design.structuralCadPrice || 0;
    }
    if (
      selectedFileTypes.includes("billOfQuantities") ||
      selectedFileTypes.includes("billOfQuantitiesPdf") ||
      selectedFileTypes.includes("billOfQuantitiesExcel")
    ) {
      total += design.billOfQuantitiesPrice || 0;
    }
  }

  if (selectedExtras) {
    total += selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  }

  return total;
};
