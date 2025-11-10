"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CgSpinner } from "react-icons/cg";
import { FiPlus, FiSearch, FiArrowRight, FiStar } from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Design {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isFeatured: boolean;
  images: { url: string }[];
  floorPlans: { url: string }[];
  architecturalDesign?: {
    pdfFiles: { url: string }[];
    cadFiles: { url: string }[];
  } | null;
  structuralDesign?: {
    pdfFiles: { url:string }[];
    cadFiles: { url: string }[];
  } | null;
  billOfQuantities?: {
    excelFiles: { url: string }[];
  } | null;
}

interface CategoryData {
  id: string;
  name: string;
  designs: Design[];
  designsTotalPages: number;
}

const truncateDescription = (text: string, maxLength: number) => {
  if (!text) return "No description available";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const CategoryPage = ({ params }: { params: { id: string } }) => {
  const categoryId = params.id;
  const [categoryName, setCategoryName] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(true);
  const [designSearchQuery, setDesignSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [designCurrentPage, setDesignCurrentPage] = useState(1);
  const [designsTotalPages, setDesignsTotalPages] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(designSearchQuery);
      setDesignCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [designSearchQuery]);

  const fetchCategoryDesigns = useCallback(async () => {
    setIsLoadingDesigns(true);
    try {
      const response = await fetch(
        `/api/admin/categories/${categoryId}?designPage=${designCurrentPage}&designLimit=8&designSearch=${debouncedSearch}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category designs");
      }
      const data: CategoryData = await response.json();
      setCategoryName(data.name);
      setDesigns(data.designs);
      setDesignsTotalPages(data.designsTotalPages);
    } catch (error) {
      console.error("Error fetching category designs:", error);
    } finally {
      setIsLoadingDesigns(false);
    }
  }, [categoryId, designCurrentPage, debouncedSearch]);

  useEffect(() => {
    fetchCategoryDesigns();
  }, [fetchCategoryDesigns]);

  const handleDesignPageChange = (page: number) => {
    if (page > 0 && page <= designsTotalPages) {
      setDesignCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate pagination items with ellipsis
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages =
      typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;

    let startPage = Math.max(
      1,
      designCurrentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(designsTotalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handleDesignPageChange(1)}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={designCurrentPage === i}
            onClick={() => handleDesignPageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < designsTotalPages) {
      if (endPage < designsTotalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={designsTotalPages}>
          <PaginationLink
            onClick={() => handleDesignPageChange(designsTotalPages)}
            className="cursor-pointer"
          >
            {designsTotalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">
            {categoryName || "Loading..."} Designs
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage designs in this category
          </p>
        </div>
        <Link
          href={`/admin/designs/new?categoryId=${categoryId}`}
          className="w-full xs:w-auto"
        >
          <Button className="w-full xs:w-auto" size="sm">
            <FiPlus className="w-4 h-4 mr-2" />
            Add New Design
          </Button>
        </Link>
      </div>

      {/* Search Section */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search designs in this category..."
            value={designSearchQuery}
            onChange={(e) => setDesignSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoadingDesigns ? (
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-center">
            <CgSpinner
              className="animate-spin text-primary mx-auto mb-4"
              size={32}
            />
            <p className="text-sm text-muted-foreground">Loading designs...</p>
          </div>
        </div>
      ) : designs.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold mb-2">No designs found</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
            {debouncedSearch
              ? "Try adjusting your search terms"
              : "Get started by adding your first design to this category"}
          </p>
          {!debouncedSearch && (
            <Link href={`/admin/designs/new?categoryId=${categoryId}`}>
              <Button>
                <FiPlus className="w-4 h-4 mr-2" />
                Create First Design
              </Button>
            </Link>
          )}
        </div>
      ) : (
        /* Designs Grid */
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {designs.map((design: Design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <Image
                    src={
                      design.images?.[0]?.url ||
                      "/images/placeholder.png"
                    }
                    alt={design.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Featured Badge */}
                  {design.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <FiStar className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                      {design.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {truncateDescription(design.description, 80)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${design.basePrice}
                      </span>
                      <span className="text-sm text-muted-foreground">USD</span>
                    </div>

                    <Link href={`/admin/designs/${design.id}`}>
                      <Button variant="outline" size="sm" className="group/btn">
                        <span>View</span>
                        <FiArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  {/* File Type Indicators */}
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    {design.architecturalDesign && (
                      <Badge variant="outline" className="text-xs">
                        Architectural
                      </Badge>
                    )}
                    {design.structuralDesign && (
                      <Badge variant="outline" className="text-xs">
                        Structural
                      </Badge>
                    )}
                    {design.billOfQuantities && (
                      <Badge variant="outline" className="text-xs">
                        BOQ
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {designsTotalPages > 1 && (
        <div className="mt-6 sm:mt-8">
          <Pagination>
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handleDesignPageChange(designCurrentPage - 1)}
                  className={
                    designCurrentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handleDesignPageChange(designCurrentPage + 1)}
                  className={
                    designCurrentPage === designsTotalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Mobile page info */}
          <div className="sm:hidden text-center mt-3">
            <p className="text-sm text-muted-foreground">
              Page {designCurrentPage} of {designsTotalPages}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
