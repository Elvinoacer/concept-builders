"use client";

import { useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import {
  FiEye,
  FiEdit,
  FiMoreVertical,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface DesignsListProps {
  designs: DesignListItem[];
  onEditClick?: (designId: string) => void;
}

interface DesignListItem {
  id: string;
  name: string;
  basePrice: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { name: string } | null;
  images?: Array<{ url: string }>;
  floorPlans?: Array<{ url: string }>;
  architecturalDesign?: {
    pdfFiles?: Array<{ url: string }>;
    cadFiles?: Array<{ url: string }>;
  } | null;
  structuralDesign?: {
    pdfFiles?: Array<{ url: string }>;
    cadFiles?: Array<{ url: string }>;
  } | null;
  billOfQuantities?: {
    excelFiles?: Array<{ url: string }>;
  } | null;
}

const DesignsList = ({ designs, onEditClick }: DesignsListProps) => {
  const desktopParentRef = useRef<HTMLDivElement>(null);
  const shouldVirtualizeDesktop = designs.length > 50;
  const rowVirtualizer = useVirtualizer({
    count: shouldVirtualizeDesktop ? designs.length : 0,
    getScrollElement: () => desktopParentRef.current,
    estimateSize: () => 74,
    overscan: 6,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  const getDesignImage = (design: DesignListItem) => {
    return design.images?.[0]?.url || "/images/design-placeholder.png";
  };

  const getTotalFileCount = (design: DesignListItem) => {
    const architecturalFiles =
      (design.architecturalDesign?.pdfFiles?.length || 0) +
      (design.architecturalDesign?.cadFiles?.length || 0);
    const structuralFiles =
      (design.structuralDesign?.pdfFiles?.length || 0) +
      (design.structuralDesign?.cadFiles?.length || 0);
    const boqFiles = design.billOfQuantities?.excelFiles?.length || 0;
    return architecturalFiles + structuralFiles + boqFiles;
  };

  const getImageCount = (design: DesignListItem) => {
    return (design.images?.length || 0) + (design.floorPlans?.length || 0);
  };

  const getFileTypeIcon = () => {
    return <FiFileText className="w-4 h-4" />;
  };

  // Mobile Card View
  const MobileDesignCard = ({ design, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {/* Design Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={getDesignImage(design)}
            alt={design.name}
            fill
            className="object-cover"
            sizes="64px"
          />
          {design.isFeatured && (
            <div className="absolute top-1 left-1">
              <Badge
                variant="default"
                className="text-xs px-1.5 py-0.5 bg-blue-500"
              >
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate text-sm leading-tight">
                {design.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FiDollarSign className="w-3 h-3" />
                  <span>{formatPrice(design.basePrice)}</span>
                </div>
                {design.category && (
                  <Badge variant="outline" className="text-xs">
                    {design.category.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Mobile Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <FiMoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/designs/${design.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEditClick?.(design.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FiEdit className="w-4 h-4" />
                  Quick Edit (Modal)
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/designs/${design.id}/edit`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit In Page
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                <span>{formatDate(design.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiImage className="w-3 h-3" />
                <span>{getImageCount(design)} images</span>
              </div>
              <div className="flex items-center gap-1">
                <FiFileText className="w-3 h-3" />
                <span>{getTotalFileCount(design)} files</span>
              </div>
            </div>

            {/* Quick View Button */}
            <Link href={`/admin/designs/${design.id}`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <FiEye className="w-3 h-3 mr-1" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Desktop Table Row
  const DesktopTableRow = ({ design, index }) => (
    <motion.tr
      key={design.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-card border-b border-border hover:bg-muted/50 transition-colors duration-150 group"
    >
      {/* Design Name with Image */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={getDesignImage(design)}
              alt={design.name}
              fill
              className="object-cover"
              sizes="40px"
            />
            {design.isFeatured && (
              <div className="absolute top-0 right-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate max-w-[200px]">
              {design.name}
            </div>
            {design.category && (
              <div className="text-xs text-muted-foreground truncate">
                {design.category.name}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <FiDollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">
            {formatPrice(design.basePrice)}
          </span>
        </div>
      </td>

      {/* Created Date - Hidden on smaller screens */}
      <td className="hidden lg:table-cell px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FiCalendar className="w-4 h-4" />
          <span>{formatDate(design.createdAt)}</span>
        </div>
      </td>

      {/* Last Modified - Hidden on smaller screens */}
      <td className="hidden xl:table-cell px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FiCalendar className="w-4 h-4" />
          <span>{formatDate(design.updatedAt)}</span>
        </div>
      </td>

      {/* Image Count - Hidden on smaller screens */}
      <td className="hidden xl:table-cell px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FiImage className="w-4 h-4" />
          <span>{getImageCount(design)} images</span>
        </div>
      </td>

      {/* File Count - Hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getFileTypeIcon()}
          <span>{getTotalFileCount(design)} files</span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Quick View Button */}
          <Link href={`/admin/designs/${design.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <FiEye className="w-4 h-4" />
              <span>View</span>
            </Button>
          </Link>

          {/* Desktop Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiMoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/designs/${design.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FiEye className="w-4 h-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditClick?.(design.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FiEdit className="w-4 h-4" />
                Quick Edit (Modal)
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/designs/${design.id}/edit`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit In Page
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile View Button */}
          <Link href={`/admin/designs/${design.id}`} className="sm:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FiEye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </td>
    </motion.tr>
  );

  return (
    <div className="space-y-3 sm:space-y-0">
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        <AnimatePresence>
          {designs.map((design, index) => (
            <MobileDesignCard key={design.id} design={design} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Table View */}
      <div
        ref={desktopParentRef}
        className="hidden sm:block overflow-x-auto rounded-lg border border-border bg-card"
      >
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Design
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Price
              </th>
              <th
                scope="col"
                className="hidden lg:table-cell px-4 py-3 font-medium"
              >
                Created
              </th>
              <th
                scope="col"
                className="hidden xl:table-cell px-4 py-3 font-medium"
              >
                Updated
              </th>
              <th
                scope="col"
                className="hidden xl:table-cell px-4 py-3 font-medium"
              >
                Images
              </th>
              <th
                scope="col"
                className="hidden md:table-cell px-4 py-3 font-medium"
              >
                Files
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {shouldVirtualizeDesktop ? (
              <>
                {rowVirtualizer.getVirtualItems().length > 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        height: `${rowVirtualizer.getVirtualItems()[0].start}px`,
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}

                <AnimatePresence>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const design = designs[virtualRow.index];
                    if (!design) return null;
                    return (
                      <DesktopTableRow
                        key={design.id}
                        design={design}
                        index={virtualRow.index}
                      />
                    );
                  })}
                </AnimatePresence>

                {rowVirtualizer.getVirtualItems().length > 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        height: `${
                          rowVirtualizer.getTotalSize() -
                          rowVirtualizer.getVirtualItems()[
                            rowVirtualizer.getVirtualItems().length - 1
                          ].end
                        }px`,
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}
              </>
            ) : (
              <AnimatePresence>
                {designs.map((design, index) => (
                  <DesktopTableRow
                    key={design.id}
                    design={design}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {designs.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No designs found
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Get started by creating your first design to showcase your work.
          </p>
        </div>
      )}
    </div>
  );
};

export default DesignsList;
