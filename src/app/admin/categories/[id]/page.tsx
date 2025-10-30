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
} from "@/components/ui/pagination";
import { CgSpinner } from "react-icons/cg";
import Link from "next/link";

interface Design {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isFeatured: boolean;
  files: { url: string; type: string }[];
  architecturalDesign?: {
    pdfFiles: { url: string }[];
    cadFiles: { url: string }[];
  } | null;
  structuralDesign?: {
    pdfFiles: { url: string }[];
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
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const CategoryPage = ({ params }: { params: { id: string } }) => {
  const categoryId = params.id;
  const [categoryName, setCategoryName] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(true);
  const [designSearchQuery, setDesignSearchQuery] = useState("");
  const [designCurrentPage, setDesignCurrentPage] = useState(1);
  const [designsTotalPages, setDesignsTotalPages] = useState(1);

  const fetchCategoryDesigns = useCallback(async () => {
    setIsLoadingDesigns(true);
    try {
      const response = await fetch(
        `/api/admin/categories/${categoryId}?designPage=${designCurrentPage}&designLimit=10&designSearch=${designSearchQuery}`
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
      // Handle error, e.g., show a toast
    } finally {
      setIsLoadingDesigns(false);
    }
  }, [categoryId, designCurrentPage, designSearchQuery]);

  useEffect(() => {
    fetchCategoryDesigns();
  }, [fetchCategoryDesigns]);

  const handleDesignPageChange = (page: number) => {
    if (page > 0 && page <= designsTotalPages) {
      setDesignCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{categoryName} Designs</h1>
        <Link
          href={`/admin/designs/new?categoryId=${categoryId}`}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Add New Design
        </Link>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search designs in this category..."
          value={designSearchQuery}
          onChange={(e) => {
            setDesignSearchQuery(e.target.value);
            setDesignCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {isLoadingDesigns ? (
        <div className="flex items-center justify-center h-48">
          <CgSpinner className="animate-spin text-primary" size={32} />
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center text-muted-foreground col-span-3 h-48 flex flex-col items-center justify-center">
          <p>No designs found in this category.</p>
          <Link
            href={`/admin/designs/new?categoryId=${categoryId}`}
            className="text-indigo-600 hover:text-indigo-500 font-semibold mt-2 inline-block"
          >
            Add a new design
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design: Design) => (
            <div
              key={design.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
            >
              <div className="relative h-64">
                <Image
                  src={
                    design.files.find((file) => file.type === "IMAGE")?.url ||
                    "/images/placeholder.png"
                  }
                  alt={design.name}
                  layout="fill"
                  objectFit="cover"
                />
                {design.isFeatured && (
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {design.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                  {truncateDescription(design.description, 100)}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${design.basePrice}
                  </span>
                  <Link
                    href={`/admin/designs/${design.id}`}
                    className="text-indigo-600 hover:text-indigo-500 font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {designsTotalPages > 1 && (
        <div className="p-4 mt-8">
          <Pagination>
            <PaginationContent>
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
              {[...Array(designsTotalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={designCurrentPage === i + 1}
                    onClick={() => handleDesignPageChange(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
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
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
