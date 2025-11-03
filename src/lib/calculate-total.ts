
import { Design, PackageOption } from '@/generated/prisma';

interface CartItem {
  quantity: number;
  selectedFileTypes: string[];
  selectedExtras?: any[];
  design: Design & { packageOptions: PackageOption[] };
}

export const calculateItemTotal = (item: CartItem): number => {
  const { design, quantity, selectedFileTypes, selectedExtras } = item;

  let total = design.basePrice * quantity;

  if (selectedFileTypes) {
    if (selectedFileTypes.includes('architecturalPdf')) {
      total += design.architecturalPdfPrice || 0;
    }
    if (selectedFileTypes.includes('architecturalCad')) {
      total += design.architecturalCadPrice || 0;
    }
    if (selectedFileTypes.includes('structuralPdf')) {
      total += design.structuralPdfPrice || 0;
    }
    if (selectedFileTypes.includes('structuralCad')) {
      total += design.structuralCadPrice || 0;
    }
    if (selectedFileTypes.includes('billOfQuantities')) {
      total += design.billOfQuantitiesPrice || 0;
    }
  }

  if (selectedExtras) {
    total += selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  }

  return total;
};
