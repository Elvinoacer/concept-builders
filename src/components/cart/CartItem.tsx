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
    selectedExtras?: Array<{ id: string; name: string; price: number }>;
    design: Design & {
      packageOptions: PackageOption[];
      images?: Array<{ url: string }>;
      architecturalDesign?: {
        pdfFiles?: unknown[];
        cadFiles?: unknown[];
      };
      structuralDesign?: {
        pdfFiles?: unknown[];
        cadFiles?: unknown[];
      };
      billOfQuantities?: {
        pdfFiles?: unknown[];
        excelFiles?: unknown[];
      };
    };
  };
  onRemove: (cartItemId: string) => void;
  onUpdate: (
    cartItemId: string,
    updates: Partial<{
      selectedFileTypes: string[];
      selectedExtras: Array<{ id: string; name: string; price: number }>;
    }>,
  ) => void;
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

  const handleExtraChange = (
    extra: { id: string; name: string; price: number },
    isChecked: boolean,
  ) => {
    const newExtras = isChecked
      ? [...safeSelectedExtras, extra]
      : safeSelectedExtras.filter((e) => e.id !== extra.id);
    onUpdate(item.cartItemId, { selectedExtras: newExtras });
  };

  const handleFileTypeChange = (type: string, isChecked: boolean) => {
    const newFileTypes = isChecked
      ? [...safeSelectedFileTypes, type]
      : safeSelectedFileTypes.filter((t) => t !== type);
    onUpdate(item.cartItemId, { selectedFileTypes: newFileTypes });
  };

  const safeSelectedFileTypes = Array.isArray(item.selectedFileTypes)
    ? item.selectedFileTypes.filter(
        (type): type is string => typeof type === "string",
      )
    : [];

  const safeSelectedExtras = Array.isArray(item.selectedExtras)
    ? item.selectedExtras.filter(
        (
          extra,
        ): extra is {
          id: string;
          name: string;
          price: number;
        } =>
          Boolean(extra) &&
          typeof extra === "object" &&
          typeof extra.id === "string" &&
          typeof extra.name === "string",
      )
    : [];

  const itemTotalPrice = calculateItemTotal(item);
  const selectedFileTypeRows = safeSelectedFileTypes.map((type) => ({
    type,
    label: getFileTypeLabel(type),
    price: getFileTypePrice(type),
    badge: type.includes("cad")
      ? "CAD"
      : type.includes("Pdf") || type.includes("pdf")
        ? "PDF"
        : type.includes("Quantities")
          ? "BOQ"
          : "FILE",
  }));
  const selectedExtrasRows = safeSelectedExtras.map((extra) => ({
    id: extra.id,
    label: extra.name,
    price: typeof extra.price === "number" ? extra.price : 0,
    badge: "ADD-ON",
  }));
  const hasSelectedRows =
    selectedFileTypeRows.length > 0 || selectedExtrasRows.length > 0;
  const fileTypeOptions = [
    {
      type: "architecturalPdf",
      label: "Architectural PDF",
      isBase: true,
      isAvailable: (item.design.architecturalDesign?.pdfFiles?.length || 0) > 0,
    },
    {
      type: "architecturalCad",
      label: "Architectural CAD",
      isAvailable: (item.design.architecturalDesign?.cadFiles?.length || 0) > 0,
    },
    {
      type: "structuralPdf",
      label: "Structural PDF",
      isAvailable: (item.design.structuralDesign?.pdfFiles?.length || 0) > 0,
    },
    {
      type: "structuralCad",
      label: "Structural CAD",
      isAvailable: (item.design.structuralDesign?.cadFiles?.length || 0) > 0,
    },
    {
      type: "billOfQuantitiesExcel",
      label: "Bill of Quantities (Excel)",
      isAvailable: (item.design.billOfQuantities?.excelFiles?.length || 0) > 0,
    },
    {
      type: "billOfQuantitiesPdf",
      label: "Bill of Quantities (PDF)",
      isAvailable: (item.design.billOfQuantities?.pdfFiles?.length || 0) > 0,
    },
  ];

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {fileTypeOptions.map((fileTypeOption) => (
                <div
                  key={fileTypeOption.type}
                  className="flex flex-col min-w-0"
                >
                  <label
                    className={`flex items-start gap-2.5 text-xs xs:text-sm ${
                      fileTypeOption.isBase
                        ? "cursor-not-allowed opacity-80"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        fileTypeOption.isBase || // Always checked if base
                        safeSelectedFileTypes.includes(fileTypeOption.type)
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
                    <span className="leading-snug text-cream-dim">
                      {fileTypeOption.label}
                      <span
                        className={
                          fileTypeOption.isBase
                            ? "text-emerald-400"
                            : "text-gold"
                        }
                      >
                        {fileTypeOption.isBase
                          ? " - Included"
                          : ` - +$${getFileTypePrice(fileTypeOption.type).toFixed(2)}`}
                      </span>
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
                        checked={safeSelectedExtras.some(
                          (e) => e.id === extra.id,
                        )}
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

          <div className="mt-6 w-full rounded-2xl border border-cb-border bg-[rgba(17,16,9,0.55)] p-4 sm:p-5">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-cream-dim mb-3">
              Selected Options Breakdown
            </p>
            <div className="rounded-xl border border-[rgba(200,137,42,0.22)] bg-[#111009] px-3 sm:px-4 py-2 sm:py-3">
              <ul className="divide-y divide-[rgba(200,185,168,0.08)]">
                <li className="flex items-center justify-between gap-3 py-2.5 opacity-85">
                  <span className="text-sm text-cream-dim">
                    Base Design (Architectural PDF)
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Included
                  </span>
                </li>

                {selectedFileTypeRows.length > 0 && (
                  <li className="py-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-cream-dim">
                      File Types
                    </p>
                  </li>
                )}

                {selectedFileTypeRows.map((row, idx) => (
                  <li
                    key={row.type || idx}
                    className="flex items-start justify-between gap-3 py-2.5"
                  >
                    <span className="min-w-0 flex-1 flex items-start gap-2">
                      <span className="mt-0.5 rounded-full border border-cb-border px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-cream-dim">
                        {row.badge}
                      </span>
                      <span className="min-w-0 text-sm leading-relaxed text-cream break-words">
                        {row.label || "Option"}
                      </span>
                    </span>
                    <span
                      className={`text-sm font-semibold whitespace-nowrap tabular-nums ${
                        row.price > 0 ? "text-[#c8892a]" : "text-emerald-400"
                      }`}
                    >
                      {row.price > 0 ? `+$${row.price.toFixed(2)}` : "Included"}
                    </span>
                  </li>
                ))}

                {selectedExtrasRows.length > 0 && (
                  <li className="py-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-cream-dim">
                      Add-ons
                    </p>
                  </li>
                )}

                {selectedExtrasRows.map((row, idx) => (
                  <li
                    key={row.id || idx}
                    className="flex items-start justify-between gap-3 py-2.5"
                  >
                    <span className="min-w-0 flex-1 flex items-start gap-2">
                      <span className="mt-0.5 rounded-full border border-cb-border px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-cream-dim">
                        {row.badge}
                      </span>
                      <span className="min-w-0 text-sm leading-relaxed text-cream break-words">
                        {row.label || "Option"}
                      </span>
                    </span>
                    <span
                      className={`text-sm font-semibold whitespace-nowrap tabular-nums ${
                        row.price > 0 ? "text-[#c8892a]" : "text-emerald-400"
                      }`}
                    >
                      {row.price > 0 ? `+$${row.price.toFixed(2)}` : "Included"}
                    </span>
                  </li>
                ))}
              </ul>

              {!hasSelectedRows && (
                <p className="py-2 text-sm text-[rgba(200,185,168,0.65)]">
                  No optional items selected.
                </p>
              )}

              <div className="mt-2 flex items-center justify-between gap-3 border-t border-[rgba(200,137,42,0.22)] pt-3">
                <span className="text-sm font-semibold uppercase tracking-[0.08em] text-cream">
                  Item Total
                </span>
                <span className="text-base font-bold text-[#c8892a] tabular-nums whitespace-nowrap">
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
