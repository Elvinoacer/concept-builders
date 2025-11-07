"use client";

import { motion, AnimatePresence } from "framer-motion";
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

const DesignsList = ({ designs }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getDesignImage = (design) => {
    // Get first image file from design files
    const imageFile = design.files?.find((file) => file.type === "IMAGE");
    return imageFile?.url || "/images/design-placeholder.png";
  };

  const getFileTypeIcon = (design) => {
    const hasImages = design.files?.some((file) => file.type === "IMAGE");
    const hasDocuments = design.files?.some((file) => file.type === "DOCUMENT");

    if (hasImages && hasDocuments) return <FiFileText className="w-4 h-4" />;
    if (hasImages) return <FiImage className="w-4 h-4" />;
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
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/designs/${design.id}/edit`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit Design
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
                {getFileTypeIcon(design)}
                <span>{design.files?.length || 0} files</span>
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

      {/* File Count - Hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getFileTypeIcon(design)}
          <span>{design.files?.length || 0} files</span>
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
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/designs/${design.id}/edit`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Design
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
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-border bg-card">
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
            <AnimatePresence>
              {designs.map((design, index) => (
                <DesktopTableRow
                  key={design.id}
                  design={design}
                  index={index}
                />
              ))}
            </AnimatePresence>
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
