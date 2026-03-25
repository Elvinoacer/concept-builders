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
import useSWR from "swr";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Failed to fetch categories" }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }
    const data: CategoriesResponse = await response.json();
    if (data.error) {
      throw new Error(data.message || data.error);
    }
    return data;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const { data, error, isLoading } = useSWR<CategoriesResponse>(
    `/api/categories?search=${encodeURIComponent(debouncedSearch)}&page=${currentPage}&limit=9`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 10_000,
    },
  );

  const categories = data?.categories || [];
  const totalPages = data?.totalPages || 1;
  const errorMessage = error instanceof Error ? error.message : null;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationRange = () => {
    if (totalPages <= 1) return [1];

    // Mobile: show fewer pages, desktop: show more
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const maxVisiblePages = width < 768 ? 3 : width < 1024 ? 5 : 7;
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
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <header className="relative h-40 xs:h-48 sm:h-56 md:h-64 rounded-b-2xl flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/images/banners/banner1.jpg"
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
                  isSearchFocused ? "text-gold" : "text-muted"
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
                className="pl-10 xs:pl-12 pr-4 py-2.5 xs:py-3 text-base border-2 border-cb-border bg-surface backdrop-blur-sm rounded-xl xs:rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 focus:border-gold w-full text-cream placeholder:text-muted"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end xs:justify-start gap-2">
            <div className="bg-surface rounded-xl border border-cb-border p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-gold text-ink shadow-sm"
                    : "text-muted hover:text-cream"
                }`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-gold text-ink shadow-sm"
                    : "text-muted hover:text-cream"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto bg-destructive/10 border border-destructive/20 rounded-xl p-4 xs:p-6">
              <div className="w-10 h-10 xs:w-12 xs:h-12 mx-auto mb-3 xs:mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
                <span className="text-destructive text-lg xs:text-xl">⚠️</span>
              </div>
              <h3 className="text-base xs:text-lg font-semibold text-destructive mb-2">
                Error Loading Categories
              </h3>
              <p className="text-destructive/80 text-xs xs:text-sm mb-3 xs:mb-4">
                {errorMessage}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gold hover:bg-gold-light text-ink rounded-lg transition-colors duration-200 text-xs xs:text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !errorMessage && (
          <div className="flex flex-col items-center justify-center h-48 xs:h-56 sm:h-64 gap-3 xs:gap-4">
            <div className="relative">
              <CgSpinner className="animate-spin text-gold" size={40} />
              <div className="absolute inset-0 bg-gradient-to-r from-gold to-gold-light blur-lg opacity-20 animate-pulse"></div>
            </div>
            <p className="text-cream-dim text-base xs:text-lg font-medium">
              Discovering categories...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !errorMessage && categories.length === 0 && (
          <div className="text-center py-12 xs:py-16">
            <div className="max-w-xs xs:max-w-sm sm:max-w-md mx-auto">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
                <FiSearch size={24} className="text-muted" />
              </div>
              <h3 className="text-lg xs:text-xl font-semibold text-cream mb-2">
                No categories found
              </h3>
              <p className="text-cream-dim text-sm xs:text-base mb-4 xs:mb-6">
                {searchQuery
                  ? `No results found for "${searchQuery}". Try adjusting your search terms.`
                  : "No categories available at the moment."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 xs:px-6 py-2 bg-gold hover:bg-gold-light text-ink rounded-lg transition-colors duration-200 text-sm xs:text-base font-semibold"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Categories Grid/List */}
        {!isLoading && !errorMessage && categories.length > 0 && (
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
                      ? "bg-card border border-cb-border shadow-md hover:shadow-2xl"
                      : "bg-card border border-cb-border shadow-sm hover:shadow-lg flex flex-col sm:flex-row items-stretch"
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
                        className={`font-bold text-cream transition-colors duration-300 group-hover:text-gold ${
                          viewMode === "grid"
                            ? "text-xl xs:text-2xl mb-2"
                            : "text-lg xs:text-xl mb-2 sm:mb-0"
                        }`}
                      >
                        {category.name}
                      </h2>

                      {viewMode === "list" && (
                        <p className="text-cream-dim text-sm xs:text-base line-clamp-2 hidden sm:block">
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
                      <div className="text-sm xs:text-base text-muted">
                        {category._count?.designs || 0} designs
                      </div>
                      <div className="flex items-center text-gold font-semibold transition-all duration-300 group-hover:translate-x-1 text-sm xs:text-base">
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
        {!isLoading &&
          !errorMessage &&
          categories.length > 0 &&
          totalPages > 1 && (
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
                          : "hover:bg-surface"
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
                          : "hover:bg-surface"
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
                              ? "bg-gold text-ink"
                              : "hover:bg-surface text-cream-dim hover:text-cream"
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
                          : "hover:bg-surface"
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
                          : "hover:bg-surface"
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
