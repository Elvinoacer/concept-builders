import React from 'react';

interface IncludedItemsProps {
  selectedPackage?: string;
  selectedExtras?: any[];
}

const IncludedItems: React.FC<IncludedItemsProps> = ({ selectedPackage, selectedExtras }) => {
  const getPackageName = (pkg: string) => {
    switch (pkg) {
      case 'pdf':
        return 'PDF Files';
      case 'cad':
        return 'CAD Files';
      case 'pdf-and-cad':
        return 'PDF + CAD Files';
      default:
        return pkg;
    }
  };

  return (
    <div className="mt-2 pl-20">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">What's included:</h4>
      <div className="mt-2 space-y-2">
        {selectedPackage && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-gray-500">description</span>
              <span>{getPackageName(selectedPackage)}</span>
            </div>
          </div>
        )}
        {selectedExtras?.map((extra: any) => (
          <div key={extra.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-gray-500">add_circle</span>
              <span>{extra.name}</span>
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-200">+${extra.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncludedItems;
