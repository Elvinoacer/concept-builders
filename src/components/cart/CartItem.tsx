"use client";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Design, PackageOption } from "@/generated/prisma/browser";
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

  const getFileTypePrice = (type: string): number => {
    switch (type) {
      case "architecturalPdf":
        return 0;
      case "architecturalCad":
        return item.design.architecturalCadPrice || 0;
      case "structuralPdf":
        return item.design.structuralPdfPrice || 0;
      case "structuralCad":
        return item.design.structuralCadPrice || 0;
      case "billOfQuantitiesPdf":
      case "billOfQuantitiesExcel":
      case "billOfQuantities":
        return item.design.billOfQuantitiesPrice || 0;
      default:
        return 0;
    }
  };

  const getFileTypeLabel = (type: string): string => {
    switch (type) {
      case "architecturalPdf":
        return "Architectural PDF";
      case "architecturalCad":
        return "Architectural CAD";
      case "structuralPdf":
        return "Structural PDF";
      case "structuralCad":
        return "Structural CAD";
      case "billOfQuantitiesPdf":
        return "Bill of Quantities (PDF)";
      case "billOfQuantitiesExcel":
        return "Bill of Quantities (Excel)";
      case "billOfQuantities":
        return "Bill of Quantities";
      default:
        return type;
    }
  };

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
  const selectedFileTypeRows = item.selectedFileTypes.map((type) => ({
    type,
    label: getFileTypeLabel(type),
    price: getFileTypePrice(type),
  }));
  const selectedExtrasRows = (item.selectedExtras || []).map((extra) => ({
    id: extra.id,
    label: extra.name,
    price: typeof extra.price === "number" ? extra.price : 0,
  }));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col xs:flex-row items-start gap-3 xs:gap-4 sm:gap-6 p-4 xs:p-5 sm:p-6 bg-card rounded-xl xs:rounded-2xl shadow-lg border border-cb-border"
    >
      <div className="w-full xs:w-auto flex justify-center xs:block">
        <div className="h-20 xs:h-24 sm:h-28 w-20 xs:w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg xs:rounded-xl border border-cb-border">
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

      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start w-full min-w-0 gap-4 xs:gap-6">
        <div className="flex-1 min-w-0 w-full">
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-cream leading-tight mb-2 xs:mb-3 line-clamp-2">
            {item.design.name}
          </h3>

          <div className="mb-3 xs:mb-4">
            <p className="text-xs xs:text-sm font-medium text-cream-dim mb-2 xs:mb-3">
              File Types:
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                {
                  type: "architecturalPdf",
                  label: "Architectural PDF",
                  isBase: true,
                  isAvailable:
                    (item.design.architecturalDesign?.pdfFiles?.length || 0) >
                    0,
                },
                {
                  type: "architecturalCad",
                  label: "Architectural CAD",
                  isAvailable:
                    (item.design.architecturalDesign?.cadFiles?.length || 0) >
                    0,
                },
                {
                  type: "structuralPdf",
                  label: "Structural PDF",
                  isAvailable:
                    (item.design.structuralDesign?.pdfFiles?.length || 0) > 0,
                },
                {
                  type: "structuralCad",
                  label: "Structural CAD",
                  isAvailable:
                    (item.design.structuralDesign?.cadFiles?.length || 0) > 0,
                },
                {
                  type: "billOfQuantitiesExcel", // Fixed key from billOfQuantities to match PurchaseSidebar
                  label: "Bill of Quantities (Excel)",
                  isAvailable:
                    (item.design.billOfQuantities?.excelFiles?.length || 0) > 0,
                },
                {
                  type: "billOfQuantitiesPdf",
                  label: "Bill of Quantities (PDF)",
                  isAvailable:
                    (item.design.billOfQuantities?.pdfFiles?.length || 0) > 0,
                },
              ].map((fileTypeOption) => (
                <div
                  key={fileTypeOption.type}
                  className="flex flex-col w-full sm:w-auto"
                >
                  <label
                    className={`flex items-center gap-2 text-xs xs:text-sm ${
                      fileTypeOption.isBase
                        ? "cursor-not-allowed opacity-80"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        fileTypeOption.isBase || // Always checked if base
                        item.selectedFileTypes.includes(fileTypeOption.type)
                      }
                      onChange={(e) => {
                        if (fileTypeOption.isBase) return; // Prevent change if base
                        handleFileTypeChange(
                          fileTypeOption.type,
                          e.target.checked,
                        );
                      }}
                      disabled={fileTypeOption.isBase}
                      className="rounded border-cb-border text-gold shadow-sm focus:border-gold focus:ring focus:ring-[rgba(200,137,42,0.35)] focus:ring-opacity-50 bg-surface w-3 h-3 xs:w-4 xs:h-4 disabled:opacity-50"
                    />
                    <span className="sm:whitespace-nowrap">
                      {fileTypeOption.label}
                      {fileTypeOption.isBase
                        ? " (Included)"
                        : ` (+$${getFileTypePrice(fileTypeOption.type).toFixed(2)})`}
                    </span>
                  </label>
                  {!fileTypeOption.isAvailable && (
                    <span className="text-[10px] text-gold ml-5 sm:ml-6 animate-pulse">
                      Available in 3 days
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {item.design.packageOptions &&
            item.design.packageOptions.length > 0 && (
              <div className="mb-3 xs:mb-4">
                <p className="text-xs xs:text-sm font-medium text-cream-dim mb-2 xs:mb-3">
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
                        className="rounded border-cb-border text-gold shadow-sm focus:border-gold focus:ring focus:ring-[rgba(200,137,42,0.35)] focus:ring-opacity-50 bg-surface w-3 h-3 xs:w-4 xs:h-4"
                      />
                      <span className="sm:whitespace-nowrap">
                        {extra.name} (+${extra.price.toFixed(2)})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          <div className="mt-5 w-full rounded-2xl border border-cb-border bg-card/80 p-4 sm:p-5 shadow-sm block relative">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cream-dim mb-3 whitespace-nowrap">
              Selected Options Breakdown
            </h4>
            <div className="rounded-xl border border-cb-border/70 divide-y divide-cb-border/60 bg-surface overflow-hidden">
              {[...selectedFileTypeRows, ...selectedExtrasRows].length > 0 ? (
                [...selectedFileTypeRows, ...selectedExtrasRows].map((row, idx) => (
                  <div
                    key={"type" in row ? row.type : row.id || idx}
                    className="flex flex-row items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <span className="flex-1 text-cream-dim font-medium truncate">
                      {row.label || "Unknown Option"}
                    </span>
                    <span
                      className={`flex-shrink-0 text-right font-bold whitespace-nowrap tabular-nums ${
                        row.price > 0 ? "text-gold" : "text-green-400"
                      }`}
                    >
                      {row.price > 0 ? `+$${row.price.toFixed(2)}` : "Included"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-cream-dim italic font-medium">
                  No additional options selected.
                </div>
              )}

              <div className="flex items-center justify-between gap-4 bg-gold/10 px-4 py-3 text-sm font-bold border-t border-gold/20">
                <span className="text-cream uppercase tracking-wide">Item Total</span>
                <span className="text-gold text-right tabular-nums whitespace-nowrap text-base">
                  ${itemTotalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row xs:flex-col sm:flex-row items-center justify-between xs:items-end sm:items-center gap-3 xs:gap-2 sm:gap-4 w-full xs:w-auto">
          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gold whitespace-nowrap">
            ${itemTotalPrice.toFixed(2)}
          </p>

          <button
            className="flex items-center justify-center w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 text-cream-dim hover:text-red-400 transition-all duration-200 bg-surface hover:bg-[rgba(239,68,68,0.12)] rounded-lg xs:rounded-xl border border-cb-border"
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-cream-dim border-t-transparent rounded-full animate-spin" />
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
