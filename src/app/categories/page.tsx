"use client";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";

// Define TypeScript interfaces
interface CategoryImage {
  url: string;
}

interface CategoryDesign {
  id: string;
  images: CategoryImage[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  isFeatured: boolean;
  image: string | null;
  _count: {
    designs: number;
  };
  designs: CategoryDesign[];
}

interface CategoriesResponse {
  categories: Category[];
  totalPages: number;
  currentPage: number;
  totalCategories: number;
  error?: string;
  message?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/categories?search=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=9`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to fetch categories" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: CategoriesResponse = await response.json();

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setCategories(data.categories || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
      setCategories([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationRange = () => {
    if (totalPages <= 1) return [1];

    const delta = 2;
    const range: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const getCategoryImageUrl = (category: Category): string => {
    // Try category image first
    if (category.image) {
      return category.image;
    }

    // Then try design images
    if (category.designs?.[0]?.images?.[0]?.url) {
      return category.designs[0].images[0].url;
    }

    // Fallback to placeholder
    return "/images/placeholder.png";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-cyan-950/10">
      {/* Header */}
      <header className="relative h-64 rounded-b-2xl flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/images/banner-1.png"
          alt="Categories background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold">Categories</h1>
          <p className="text-lg md:text-xl mt-2">
            Discover our curated collection of categories
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="mb-8 px-4 sm:px-0">
          <div
            className={`relative max-w-2xl mx-auto transition-all duration-300 ${
              isSearchFocused ? "scale-105" : "scale-100"
            }`}
          >
            <div className="relative">
              <FiSearch
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  isSearchFocused
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                size={20}
              />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">
                  ⚠️
                </span>
              </div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                Error Loading Categories
              </h3>
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                {error}
              </p>
              <button
                onClick={fetchCategories}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="relative">
              <CgSpinner
                className="animate-spin text-blue-600 dark:text-blue-400"
                size={48}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 blur-lg opacity-20 animate-pulse"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              Discovering categories...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                <FiSearch
                  size={32}
                  className="text-gray-500 dark:text-gray-400"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchQuery
                  ? `No results found for "${searchQuery}". Try adjusting your search terms.`
                  : "No categories available at the moment."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Categories Grid/List */}
        {!isLoading && !error && categories.length > 0 && (
          <div
            className={`px-4 sm:px-0 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                : "grid grid-cols-1 gap-6 max-w-4xl mx-auto"
            }`}
          >
            {categories.map((category) => (
              <Link href={`/categories/${category.id}`} key={category.id}>
                <div
                  className={`group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl rounded-2xl overflow-hidden ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-800 shadow-lg"
                      : "bg-white dark:bg-gray-800 shadow-md flex items-center"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "grid"
                        ? "h-64 w-full"
                        : "h-24 w-24 flex-shrink-0"
                    }`}
                  >
                    <Image
                      src={getCategoryImageUrl(category)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes={
                        viewMode === "grid"
                          ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          : "96px"
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div
                    className={`p-6 flex-1 ${
                      viewMode === "list"
                        ? "flex justify-between items-center"
                        : ""
                    }`}
                  >
                    <div>
                      <h2
                        className={`font-bold text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                          viewMode === "grid" ? "text-2xl mb-2" : "text-xl"
                        }`}
                      >
                        {category.name}
                      </h2>
                      {viewMode === "grid" && category.description && (
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-base">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-base text-gray-500 dark:text-gray-400">
                        {category._count?.designs || 0} designs
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold transition-all duration-300 group-hover:translate-x-1">
                        <span className="text-base">Explore</span>
                        <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && categories.length > 0 && totalPages > 1 && (
          <div className="mt-12 px-4 sm:px-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationFirst
                    onClick={() => handlePageChange(1)}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {getPaginationRange().map((page, index) => {
                  if (page === "...") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={totalPages === currentPage}
                    className={
                      totalPages === currentPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast
                    onClick={() => handlePageChange(totalPages)}
                    aria-disabled={totalPages === currentPage}
                    className={
                      totalPages === currentPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}
