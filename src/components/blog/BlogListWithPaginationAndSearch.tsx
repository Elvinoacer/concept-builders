"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Post } from "@/generated/prisma";
import { BlogPostCard, BlogPostCardSkeleton } from "./BlogPostCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

const BlogListWithPaginationAndSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    try {
      const res = await fetch(`/api/blog?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch blog posts");
      }
      const result = await res.json();
      setPosts(result.data.posts);
      setTotalPages(result.data.pagination.totalPages);
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while fetching posts."
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(pageParam);
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderPagination = () => {
    const pages = [];

    // Smart pagination - show limited pages on mobile
    const maxVisiblePages =
      window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 5 : 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            className="min-w-[2.5rem] xs:min-w-[3rem] text-sm xs:text-base"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination className="mt-6 sm:mt-8 lg:mt-12">
        <PaginationContent className="flex-wrap gap-1 sm:gap-2 justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.max(1, currentPage - 1));
              }}
              className="text-sm xs:text-base px-2 xs:px-4"
            />
          </PaginationItem>
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                  className="min-w-[2.5rem] xs:min-w-[3rem] text-sm xs:text-base"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <span className="px-2 text-muted-foreground">...</span>
                </PaginationItem>
              )}
            </>
          )}
          {pages}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <span className="px-2 text-muted-foreground">...</span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                  className="min-w-[2.5rem] xs:min-w-[3rem] text-sm xs:text-base"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.min(totalPages, currentPage + 1));
              }}
              className="text-sm xs:text-base px-2 xs:px-4"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <main className="col-span-full lg:col-span-8 xl:col-span-9 2xl:col-span-8 w-full min-w-0">
      {/* Search Input */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <input
          type="text"
          placeholder="Search blog posts..."
          className="w-full rounded-lg xs:rounded-xl border border-gray-300 dark:border-gray-600 px-3 xs:px-4 sm:px-5 py-2.5 sm:py-3 lg:py-3.5 text-sm xs:text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, index) => (
            <BlogPostCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        // Error State
        <div
          className="bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 px-4 py-4 sm:py-6 rounded-lg text-center"
          role="alert"
        >
          <span className="block text-sm sm:text-base">{error}</span>
          <button
            onClick={fetchPosts}
            className="mt-3 sm:mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-6 sm:p-8 lg:p-12 text-center shadow-sm">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-4 sm:mb-6 text-muted-foreground/50">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-foreground mb-2 sm:mb-3">
            No Posts Found
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `No results found for "${searchQuery}". Try adjusting your search terms.`
              : "No blog posts available yet. Check back soon!"}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("search");
                params.set("page", "1");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        // Posts Grid
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && renderPagination()}
    </main>
  );
};

export default BlogListWithPaginationAndSearch;
