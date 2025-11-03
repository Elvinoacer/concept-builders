"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";

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
    <motion.li
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-start py-6 gap-4"
    >
      {/* ... (Image and other static parts) ... */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-gray-700">
        <Image
          alt={item.design.name}
          className="h-full w-full object-cover object-center"
          src={
            item.design.images && item.design.images.length > 0
              ? item.design.images[0].url
              : "/images/category-placeholder.png"
          }
          width={100}
          height={100}
        />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {item.design.name}
          </h3>

          <div className="mt-2">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              File Types:
            </p>
            <div className="flex flex-col gap-1 mt-1">
              {[
                { type: "architecturalPdf", label: "Architectural PDF" },
                { type: "architecturalCad", label: "Architectural CAD" },
                { type: "structuralPdf", label: "Structural PDF" },
                { type: "structuralCad", label: "Structural CAD" },
                { type: "billOfQuantities", label: "Bill of Quantities" },
              ].map((fileTypeOption) => (
                <label
                  key={fileTypeOption.type}
                  className="flex items-center gap-2 text-sm"
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
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600"
                  />
                  {fileTypeOption.label}
                </label>
              ))}
            </div>
          </div>

          {item.design.packageOptions &&
            item.design.packageOptions.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Package Customizations:
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  {item.design.packageOptions.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex items-center gap-2 text-sm"
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
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600"
                      />
                      {extra.name} (+${extra.price.toFixed(2)})
                    </label>
                  ))}
                </div>
              </div>
            )}
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <p className="text-lg font-medium text-slate-900 dark:text-white">
            ${itemTotalPrice.toFixed(2)}
          </p>
          <button
            className="text-slate-500 hover:text-red-500 transition-colors"
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 size={20} />
                <span className="sr-only">Remove</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.li>
  );
};

export default CartItem;
