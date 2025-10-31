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

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/categories?search=${searchQuery}&page=${currentPage}&limit=9`
    );
    const data = await response.json();
    setCategories(data.categories);
    setTotalPages(data.totalPages);
    setIsLoading(false);
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
    const delta = 2;
    const range = [];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-cyan-950/10">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-300">
                Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Discover our curated collection of categories
              </p>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
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

        {/* Loading State */}
        {isLoading ? (
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
        ) : categories.length === 0 ? (
          /* Empty State */
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
        ) : (
          /* Categories Grid/List */
          <div
            className={`px-4 sm:px-0 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
            }`}
          >
            {categories.map((category: any) => (
              <Link href={`/categories/${category.id}`} key={category.id}>
                <div
                  className={`
                  group cursor-pointer transition-all duration-500 transform hover:scale-[1.02]
                  ${
                    viewMode === "grid"
                      ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden"
                      : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/60 dark:border-gray-700/60 p-6 flex items-center gap-6"
                  }
                `}
                >
                  {/* Image Container */}
                  <div
                    className={`
                    relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20
                    ${
                      viewMode === "grid"
                        ? "h-64 w-full"
                        : "h-24 w-24 rounded-xl flex-shrink-0"
                    }
                  `}
                  >
                    <Image
                      src={category.designs[0]?.images[0]?.url || "/images/placeholder.png"}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className={viewMode === "grid" ? "p-6" : "flex-1"}>
                    <div className="flex items-center justify-between">
                      <h2
                        className={`
                        font-semibold text-gray-800 dark:text-white transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400
                        ${viewMode === "grid" ? "text-xl mb-2" : "text-lg"}
                      `}
                      >
                        {category.name}
                      </h2>
                      {category.isFeatured && (
                        <div className="text-xs font-semibold text-white bg-green-500 rounded-full px-2 py-1">
                          Best Seller
                        </div>
                      )}
                    </div>
                    {viewMode === "grid" && category.description && (
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div
                        className={`
                        flex items-center text-blue-600 dark:text-blue-400 font-medium transition-all duration-200 group-hover:translate-x-1
                        ${viewMode === "grid" ? "mt-4" : "mt-2"}
                      `}
                      >
                        <span className="text-sm">Explore</span>
                        <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {category._count.designs} designs
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {categories.length > 0 && (
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
                        : undefined
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
                        : undefined
                    }
                  />
                </PaginationItem>
                {getPaginationRange().map((page, index) => {
                  if (page === "...") {
                    return (
                      <PaginationItem key={index}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
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
                        : undefined
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
                        : undefined
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
