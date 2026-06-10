"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Post } from "@/generated/prisma/browser";
import { BlogPostCard, BlogPostCardSkeleton } from "./BlogPostCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import FeaturedPost, { FeaturedPostSkeleton } from "./FeaturedPost";
import { AlertCircle, Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");

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
        err.message || "An unexpected error occurred while fetching posts.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    if (!searchParams) return;
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(pageParam);
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (page: number) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderPagination = () => {
    const pages = [];
    // Safe standard rendering bounds matching mobile displays perfectly
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
            className="min-w-[2.25rem] h-9 sm:min-w-[2.75rem] sm:h-11 text-xs sm:text-sm rounded-xl"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return (
      <Pagination className="w-full">
        <PaginationContent className="flex flex-wrap gap-1 sm:gap-2 justify-center items-center w-full">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className="text-xs sm:text-sm px-2 sm:px-3 h-9 sm:h-11 rounded-xl"
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
                  className="min-w-[2.25rem] h-9 sm:min-w-[2.75rem] sm:h-11 text-xs sm:text-sm rounded-xl"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <span className="px-1 text-muted-foreground text-xs sm:text-sm">
                    ...
                  </span>
                </PaginationItem>
              )}
            </>
          )}

          {pages}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <span className="px-1 text-muted-foreground text-xs sm:text-sm">
                    ...
                  </span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                  className="min-w-[2.25rem] h-9 sm:min-w-[2.75rem] sm:h-11 text-xs sm:text-sm rounded-xl"
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
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className="text-xs sm:text-sm px-2 sm:px-3 h-9 sm:h-11 rounded-xl"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="w-full min-w-0">
      {loading ? (
        <div className="space-y-12 sm:space-y-16">
          <FeaturedPostSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {[...Array(4)].map((_, index) => (
              <BlogPostCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="py-16 sm:py-24 px-4 text-center space-y-6 max-w-md mx-auto flex flex-col items-center justify-center">
          <div className="p-4 bg-red-500/10 rounded-full text-red-500">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gold uppercase tracking-tight">
            Feed Error
          </h2>
          <p className="text-cream-dim text-sm sm:text-base leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchPosts}
            className="w-full sm:w-auto px-8 py-3.5 bg-gold text-ink font-black uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all text-xs"
          >
            Retry Fetch
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 sm:py-24 px-4 text-center space-y-6 max-w-md mx-auto flex flex-col items-center justify-center">
          <div className="p-5 bg-surface rounded-full border border-cb-border text-gold/40">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Empty Archives
          </h2>
          <p className="text-cream-dim text-sm sm:text-base leading-relaxed">
            {searchQuery
              ? `No chronicles match the query "${searchQuery}". Try widening your keywords.`
              : "Our design scribes are currently crafting stories. Check back shortly for new layout insights."}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                if (!searchParams) return;
                setSearchQuery("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("search");
                params.set("page", "1");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="w-full sm:w-auto px-8 py-3.5 border-2 border-gold text-gold font-black uppercase tracking-widest rounded-xl hover:bg-gold/10 transition-all text-xs"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* Featured items show only on root feed layout page */}
          {currentPage === 1 && !searchQuery && posts[0] && (
            <div className="w-full">
              <FeaturedPost post={posts[0]} />
            </div>
          )}

          {/* Clean Unified Fluid Dynamic Grid Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            {(currentPage === 1 && !searchQuery ? posts.slice(1) : posts).map(
              (post, index) => (
                <BlogPostCard key={post.id} post={post} index={index} />
              ),
            )}
          </div>
        </div>
      )}

      {/* Structured Pagination Box */}
      {totalPages > 1 && !loading && (
        <div className="mt-12 sm:mt-20 pt-8 border-t border-cb-border flex justify-center w-full overflow-x-auto">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default BlogListWithPaginationAndSearch;
