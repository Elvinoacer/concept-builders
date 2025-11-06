"use client";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Design, PackageOption } from "@/generated/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";

interface CartItemProps {
  item: {
    cartItemId: string;
    quantity: number;
    selectedFileTypes: string[];
    selectedExtras?: any[];
    design: Design & { packageOptions: PackageOption[] };
    images: { url: string }[];
  };
  onRemove: (cartItemId: string) => void;
  onUpdate: (cartItemId: string, updates: Partial<any>) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdate }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item.cartItemId);
    setIsRemoving(false);
  };

  const handleExtraChange = (extra, isChecked) => {
    const newExtras = isChecked
      ? [...(item.selectedExtras || []), extra]
      : (item.selectedExtras || []).filter((e) => e.id !== extra.id);
    onUpdate(item.cartItemId, { selectedExtras: newExtras });
  };

  const handleFileTypeChange = (type, isChecked) => {
    const newFileTypes = isChecked
      ? [...item.selectedFileTypes, type]
      : item.selectedFileTypes.filter((t) => t !== type);
    onUpdate(item.cartItemId, { selectedFileTypes: newFileTypes });
  };

  const itemTotalPrice = calculateItemTotal(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col xs:flex-row items-start gap-3 xs:gap-4 sm:gap-6 p-4 xs:p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      {/* Product Image */}
      <div className="w-full xs:w-auto flex justify-center xs:block">
        <div className="h-20 xs:h-24 sm:h-28 w-20 xs:w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg xs:rounded-xl border border-slate-200 dark:border-gray-700">
          <Image
            alt={item.design.name}
            className="h-full w-full object-cover object-center"
            src={
              item.design.images && item.design.images.length > 0
                ? item.design.images[0].url
                : "/images/category-placeholder.png"
            }
            width={112}
            height={112}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
            sizes="(max-width: 480px) 80px, (max-width: 640px) 96px, 112px"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start w-full min-w-0 gap-4 xs:gap-6">
        {/* Left Column - Product Info */}
        <div className="flex-1 min-w-0 w-full">
          {/* Product Name */}
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-tight mb-2 xs:mb-3 line-clamp-2">
            {item.design.name}
          </h3>

          {/* File Types Selection */}
          <div className="mb-3 xs:mb-4">
            <p className="text-xs xs:text-sm font-medium text-slate-500 dark:text-gray-400 mb-2 xs:mb-3">
              File Types:
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                { type: "architecturalPdf", label: "Architectural PDF" },
                { type: "architecturalCad", label: "Architectural CAD" },
                { type: "structuralPdf", label: "Structural PDF" },
                { type: "structuralCad", label: "Structural CAD" },
                { type: "billOfQuantities", label: "Bill of Quantities" },
              ].map((fileTypeOption) => (
                <label
                  key={fileTypeOption.type}
                  className="flex items-center gap-2 text-xs xs:text-sm w-full sm:w-auto"
                >
                  <input
                    type="checkbox"
                    checked={item.selectedFileTypes.includes(
                      fileTypeOption.type
                    )}
                    onChange={(e) =>
                      handleFileTypeChange(
                        fileTypeOption.type,
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 w-3 h-3 xs:w-4 xs:h-4"
                  />
                  <span className="sm:whitespace-nowrap">{fileTypeOption.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Package Customizations */}
          {item.design.packageOptions &&
            item.design.packageOptions.length > 0 && (
              <div className="mb-3 xs:mb-4">
                <p className="text-xs xs:text-sm font-medium text-slate-500 dark:text-gray-400 mb-2 xs:mb-3">
                  Package Customizations:
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {item.design.packageOptions.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex items-center gap-2 text-xs xs:text-sm w-full sm:w-auto"
                    >
                      <input
                        type="checkbox"
                        checked={
                          item.selectedExtras &&
                          item.selectedExtras.some((e) => e.id === extra.id)
                        }
                        onChange={(e) =>
                          handleExtraChange(extra, e.target.checked)
                        }
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 w-3 h-3 xs:w-4 xs:h-4"
                      />
                      <span className="sm:whitespace-nowrap">
                        {extra.name} (+${extra.price.toFixed(2)})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Right Column - Price and Actions */}
        <div className="flex flex-row xs:flex-col sm:flex-row items-center justify-between xs:items-end sm:items-center gap-3 xs:gap-2 sm:gap-4 w-full xs:w-auto">
          {/* Price */}
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
            ${itemTotalPrice.toFixed(2)}
          </p>

          {/* Remove Button */}
          <button
            className="flex items-center justify-center w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 text-slate-500 hover:text-red-500 transition-all duration-200 bg-gray-50 hover:bg-red-50 dark:bg-gray-700 dark:hover:bg-red-900/20 rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-600"
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                <span className="sr-only">Remove {item.design.name}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
