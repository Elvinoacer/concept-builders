"use client";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";

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

    // Mobile: show fewer pages, desktop: show more
    const maxVisiblePages =
      window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 5 : 7;
    const delta = Math.floor(maxVisiblePages / 2);

    const range: (number | string)[] = [];
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    // Adjust if we're near the start
    if (currentPage - delta <= 2) {
      end = Math.min(totalPages - 1, maxVisiblePages);
    }

    // Adjust if we're near the end
    if (currentPage + delta >= totalPages - 1) {
      start = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 2) {
      range.unshift("...");
    }
    if (end < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const getCategoryImageUrl = (category: Category): string => {
    if (category.image) {
      return category.image;
    }
    if (category.designs?.[0]?.images?.[0]?.url) {
      return category.designs[0].images[0].url;
    }
    return "/images/placeholder.png";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-cyan-950/10">
      {/* Header */}
      <header className="relative h-40 xs:h-48 sm:h-56 md:h-64 rounded-b-2xl flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/images/banner-1.png"
          alt="Categories background"
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Categories
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl mt-2 xs:mt-3 opacity-90">
            Discover our curated collection of categories
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Controls Section */}
        <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 mb-6 sm:mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused ? "scale-[1.02]" : "scale-100"
              }`}
            >
              <FiSearch
                className={`absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 z-10 ${
                  isSearchFocused
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                size={18}
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
                className="pl-10 xs:pl-12 pr-4 py-2.5 xs:py-3 text-base border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 focus:border-blue-500 dark:focus:border-blue-400 w-full"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end xs:justify-start gap-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 xs:p-6">
              <div className="w-10 h-10 xs:w-12 xs:h-12 mx-auto mb-3 xs:mb-4 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-lg xs:text-xl">
                  ⚠️
                </span>
              </div>
              <h3 className="text-base xs:text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                Error Loading Categories
              </h3>
              <p className="text-red-600 dark:text-red-400 text-xs xs:text-sm mb-3 xs:mb-4">
                {error}
              </p>
              <button
                onClick={fetchCategories}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-xs xs:text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-48 xs:h-56 sm:h-64 gap-3 xs:gap-4">
            <div className="relative">
              <CgSpinner
                className="animate-spin text-blue-600 dark:text-blue-400"
                size={40}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 blur-lg opacity-20 animate-pulse"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base xs:text-lg font-medium">
              Discovering categories...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="text-center py-12 xs:py-16">
            <div className="max-w-xs xs:max-w-sm sm:max-w-md mx-auto">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                <FiSearch
                  size={24}
                  className="text-gray-500 dark:text-gray-400"
                />
              </div>
              <h3 className="text-lg xs:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base mb-4 xs:mb-6">
                {searchQuery
                  ? `No results found for "${searchQuery}". Try adjusting your search terms.`
                  : "No categories available at the moment."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 xs:px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm xs:text-base"
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
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 lg:gap-8"
                : "grid grid-cols-1 gap-4 xs:gap-6 max-w-4xl mx-auto"
            }`}
          >
            {categories.map((category) => (
              <Link href={`/categories/${category.id}`} key={category.id}>
                <div
                  className={`group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl rounded-xl xs:rounded-2xl overflow-hidden ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl"
                      : "bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg flex flex-col sm:flex-row items-stretch"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "grid"
                        ? "h-48 xs:h-56 sm:h-64 w-full"
                        : "h-40 xs:h-48 sm:h-56 w-full sm:w-48 lg:w-56 flex-shrink-0"
                    }`}
                  >
                    <Image
                      src={getCategoryImageUrl(category)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes={
                        viewMode === "grid"
                          ? "(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          : "(max-width: 640px) 100vw, (max-width: 768px) 192px, 224px"
                      }
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Featured Badge */}
                    {category.isFeatured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex-1 p-4 xs:p-5 sm:p-6 ${
                      viewMode === "list"
                        ? "flex flex-col sm:flex-row sm:justify-between sm:items-center"
                        : ""
                    }`}
                  >
                    <div className="flex-1">
                      <h2
                        className={`font-bold text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                          viewMode === "grid"
                            ? "text-xl xs:text-2xl mb-2"
                            : "text-lg xs:text-xl mb-2 sm:mb-0"
                        }`}
                      >
                        {category.name}
                      </h2>

                      {viewMode === "list" && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base line-clamp-2 hidden sm:block">
                          {category.description ||
                            `Explore ${category._count?.designs || 0} amazing designs`}
                        </p>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between mt-3 xs:mt-4 ${
                        viewMode === "list"
                          ? "sm:flex-col sm:items-end sm:gap-2"
                          : ""
                      }`}
                    >
                      <div className="text-sm xs:text-base text-gray-500 dark:text-gray-400">
                        {category._count?.designs || 0} designs
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold transition-all duration-300 group-hover:translate-x-1 text-sm xs:text-base">
                        <span>Explore</span>
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
          <div className="mt-8 xs:mt-10 sm:mt-12">
            <Pagination>
              <PaginationContent className="flex-wrap gap-1 xs:gap-2 justify-center">
                <PaginationItem>
                  <PaginationFirst
                    onClick={() => handlePageChange(1)}
                    aria-disabled={currentPage === 1}
                    className={`cursor-pointer text-xs xs:text-sm p-2 xs:p-3 ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                    className={`cursor-pointer text-xs xs:text-sm p-2 xs:p-3 ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  />
                </PaginationItem>

                {getPaginationRange().map((page, index) => {
                  if (page === "...") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="p-2 xs:p-3" />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className={`cursor-pointer text-xs xs:text-sm min-w-[2rem] xs:min-w-[2.5rem] ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
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
                    className={`cursor-pointer text-xs xs:text-sm p-2 xs:p-3 ${
                      totalPages === currentPage
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast
                    onClick={() => handlePageChange(totalPages)}
                    aria-disabled={totalPages === currentPage}
                    className={`cursor-pointer text-xs xs:text-sm p-2 xs:p-3 ${
                      totalPages === currentPage
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
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
