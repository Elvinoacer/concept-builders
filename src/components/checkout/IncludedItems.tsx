import React from 'react';
import { Design } from '@/generated/prisma';

interface IncludedItemsProps {
  selectedFileTypes: string[];
  selectedExtras: any[];
  design: Design & { packageOptions: { id: string; name: string; price: number; fileId: string | null; designId: string }[] };
}

const getFileTypeName = (type: string) => {
  switch (type) {
    case 'architecturalPdf':
      return 'Architectural PDF';
    case 'architecturalCad':
      return 'Architectural CAD';
    case 'structuralPdf':
      return 'Structural PDF';
    case 'structuralCad':
      return 'Structural CAD';
    case 'billOfQuantities':
      return 'Bill of Quantities';
    default:
      return type;
  }
};

const getFileTypePrice = (type: string, design: Design) => {
  switch (type) {
    case 'architecturalPdf':
      return design.architecturalPdfPrice;
    case 'architecturalCad':
      return design.architecturalCadPrice;
    case 'structuralPdf':
      return design.structuralPdfPrice;
    case 'structuralCad':
      return design.structuralCadPrice;
    case 'billOfQuantities':
      return design.billOfQuantitiesPrice;
    default:
      return 0;
  }
};

const IncludedItems: React.FC<IncludedItemsProps> = ({
  selectedFileTypes,
  selectedExtras,
  design,
}) => {
  return (
    <div className="space-y-2">
      {selectedFileTypes.map((type) => (
        <div key={type} className="flex justify-between text-sm">
          <span className="text-gray-600">{getFileTypeName(type)}</span>
          <span className="font-medium">
            {getFileTypePrice(type, design) ? `$${getFileTypePrice(type, design).toFixed(2)}` : 'Included'}
          </span>
        </div>
      ))}
      {selectedExtras.map((extra) => (
        <div key={extra.id} className="flex justify-between text-sm">
          <span className="text-gray-600">{extra.name}</span>
          <span className="font-medium">
            {extra.price ? `$${extra.price.toFixed(2)}` : 'Included'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default IncludedItems;
