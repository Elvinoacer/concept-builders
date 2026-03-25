import React from "react";
import { Design } from "@/generated/prisma/browser";

interface IncludedItemsProps {
  selectedFileTypes: string[];
  selectedExtras: any[];
  design: Design & {
    packageOptions: {
      id: string;
      name: string;
      price: number;
      fileId: string | null;
      designId: string;
    }[];
  };
}

const getFileTypeName = (type: string) => {
  switch (type) {
    case "architecturalPdf":
      return "Architectural PDF";
    case "architecturalCad":
      return "Architectural CAD";
    case "structuralPdf":
      return "Structural PDF";
    case "structuralCad":
      return "Structural CAD";
    case "billOfQuantities":
      return "Bill of Quantities";
    case "billOfQuantitiesPdf":
      return "Bill of Quantities (PDF)";
    case "billOfQuantitiesExcel":
      return "Bill of Quantities (Excel)";
    default:
      return type;
  }
};

const getFileTypePrice = (type: string, design: Design) => {
  switch (type) {
    case "architecturalPdf":
      return 0;
    case "architecturalCad":
      return design.architecturalCadPrice;
    case "structuralPdf":
      return design.structuralPdfPrice;
    case "structuralCad":
      return design.structuralCadPrice;
    case "billOfQuantities":
    case "billOfQuantitiesPdf":
    case "billOfQuantitiesExcel":
      return design.billOfQuantitiesPrice;
    default:
      return 0;
  }
};

const getFileTypeIcon = (type: string) => {
  switch (type) {
    case "architecturalPdf":
    case "structuralPdf":
      return (
        <svg
          className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "architecturalCad":
    case "structuralCad":
      return (
        <svg
          className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
      );
    case "billOfQuantities":
    case "billOfQuantitiesPdf":
    case "billOfQuantitiesExcel":
      return (
        <svg
          className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
  }
};

const getExtraIcon = (extra: any) => {
  return (
    <svg
      className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
};

const IncludedItems: React.FC<IncludedItemsProps> = ({
  selectedFileTypes,
  selectedExtras,
  design,
}) => {
  const hasItems = selectedFileTypes.length > 0 || selectedExtras.length > 0;

  if (!hasItems) {
    return (
      <div className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 italic">
        No additional items selected
      </div>
    );
  }

  return (
    <div className="space-y-1.5 xs:space-y-2">
      {/* File Types */}
      {selectedFileTypes.map((type) => {
        const price = getFileTypePrice(type, design);
        const isIncluded = !price || price === 0;

        return (
          <div
            key={type}
            className="flex items-center justify-between text-xs xs:text-sm group hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 py-1.5 xs:px-3 xs:py-2 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center gap-1.5 xs:gap-2 min-w-0 flex-1">
              <div
                className={`p-0.5 xs:p-1 rounded ${
                  isIncluded
                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                    : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                {getFileTypeIcon(type)}
              </div>
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {getFileTypeName(type)}
              </span>
            </div>
            <span
              className={`font-medium whitespace-nowrap ml-2 ${
                isIncluded
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {isIncluded ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 xs:w-3.5 xs:h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden xs:inline">Included</span>
                  <span className="xs:hidden">Inc.</span>
                </span>
              ) : (
                `$${price.toFixed(2)}`
              )}
            </span>
          </div>
        );
      })}

      {/* Package Extras */}
      {selectedExtras.map((extra) => {
        const isIncluded = !extra.price || extra.price === 0;

        return (
          <div
            key={extra.id}
            className="flex items-center justify-between text-xs xs:text-sm group hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 py-1.5 xs:px-3 xs:py-2 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center gap-1.5 xs:gap-2 min-w-0 flex-1">
              <div
                className={`p-0.5 xs:p-1 rounded ${
                  isIncluded
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                }`}
              >
                {getExtraIcon(extra)}
              </div>
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {extra.name}
              </span>
            </div>
            <span
              className={`font-medium whitespace-nowrap ml-2 ${
                isIncluded
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {isIncluded ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 xs:w-3.5 xs:h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden xs:inline">Included</span>
                  <span className="xs:hidden">Inc.</span>
                </span>
              ) : (
                `$${extra.price.toFixed(2)}`
              )}
            </span>
          </div>
        );
      })}

      {/* Summary Badge */}
      {(selectedFileTypes.length > 0 || selectedExtras.length > 0) && (
        <div className="pt-1 xs:pt-2 mt-1 xs:mt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs xs:text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              Total Items:
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
              {selectedFileTypes.length + selectedExtras.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncludedItems;
