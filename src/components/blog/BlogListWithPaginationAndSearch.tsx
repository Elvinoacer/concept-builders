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
import { AlertCircle, Search, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const BlogListWithPaginationAndSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (!searchParams) return null;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") || ""
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
    const pageParam = parseInt(searchParams?.get("page") || "1", 10);
    setCurrentPage(pageParam);
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const params = new URLSearchParams(searchParams?.toString() || "");
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
    <div className="w-full">
      {/* Feed Content */}
      {loading ? (
        <div className="space-y-12">
          {/* Featured Skeleton */}
          <FeaturedPostSkeleton />
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[...Array(4)].map((_, index) => (
              <BlogPostCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="py-20 text-center space-y-8 max-w-md mx-auto">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          <h2 className="text-3xl font-black text-gold uppercase">Feed Error</h2>
          <p className="text-cream-dim text-lg leading-relaxed">{error}</p>
          <button
            onClick={fetchPosts}
            className="px-10 py-4 bg-gold text-ink font-black uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all"
          >
            Retry Fetch
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-24 text-center space-y-8 max-w-lg mx-auto">
          <div className="relative w-32 h-32 mx-auto">
            <Search className="w-full h-full text-gold/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-dashed border-gold/20 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Empty Archives</h2>
          <p className="text-cream-dim text-lg leading-relaxed">
            {searchQuery
              ? `No chronicles match the query "${searchQuery}". Try broadening your search.`
              : "Our scribes are currently crafting new stories. Check back soon for fresh insights."}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                const params = new URLSearchParams(searchParams?.toString() || "");
                params.delete("search");
                params.set("page", "1");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="px-10 py-4 border-2 border-gold text-gold font-black uppercase tracking-widest rounded-xl hover:bg-gold/10 transition-all"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-20">
          {/* First post is featured only on Page 1 if no search */}
          {currentPage === 1 && !searchQuery && posts[0] && (
            <FeaturedPost post={posts[0]} />
          )}

          {/* Grid of remaining posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {(currentPage === 1 && !searchQuery ? posts.slice(1) : posts).map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination Container */}
      {totalPages > 1 && !loading && (
        <div className="mt-16 sm:mt-24 pt-12 border-t border-cb-border flex justify-center">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default BlogListWithPaginationAndSearch;
