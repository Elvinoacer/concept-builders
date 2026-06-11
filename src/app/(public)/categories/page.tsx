"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
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
import { CgSpinner } from "react-icons/cg";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";

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
  const [categorySort, setCategorySort] = useState("name");

  const serifSystem =
    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
  const monoSystem =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

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
    `/api/categories?search=${encodeURIComponent(debouncedSearch)}&page=${currentPage}&limit=12`,
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
  const totalCategories = data?.totalCategories || 0;
  const errorMessage = error instanceof Error ? error.message : null;

  const sortedCategories = React.useMemo(() => {
    if (!categories.length) return [];
    return [...categories].sort((a, b) =>
      categorySort === "designs"
        ? (b._count?.designs || 0) - (a._count?.designs || 0)
        : a.name.localeCompare(b.name)
    );
  }, [categories, categorySort]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationRange = () => {
    if (totalPages <= 1) return [1];

    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const maxVisiblePages = width < 768 ? 3 : width < 1024 ? 5 : 7;
    const delta = Math.floor(maxVisiblePages / 2);

    const range: (number | string)[] = [];
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage - delta <= 2) {
      end = Math.min(totalPages - 1, maxVisiblePages);
    }

    if (currentPage + delta >= totalPages - 1) {
      start = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 2) range.unshift("...");
    if (end < totalPages - 1) range.push("...");

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const getCategoryImageUrl = (category: Category): string => {
    if (category.image) return category.image;
    if (category.designs?.[0]?.images?.[0]?.url) {
      return category.designs[0].images[0].url;
    }
    return "/images/banners/banner1.webp";
  };

  return (
    <div className="min-h-screen bg-ink text-cream">
      <section className="relative overflow-hidden border-b border-[rgba(240,232,216,0.08)] px-6 pb-12 pt-28 sm:px-10 lg:px-[60px] lg:pt-40">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "url('/images/banners/banner1.webp')", backgroundSize: "cover", backgroundPosition: "center top", opacity: 0.08 }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_78%_36%,rgba(200,137,42,0.08),transparent_65%),radial-gradient(ellipse_45%_42%_at_18%_82%,rgba(200,137,42,0.04),transparent_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:88px_88px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.5)_24%,rgba(0,0,0,0.5)_76%,transparent)]" />
        </div>

        <p
          className="pointer-events-none absolute bottom-[-38px] right-[-14px] select-none whitespace-nowrap text-[clamp(104px,16vw,220px)] font-light leading-none text-[rgba(200,137,42,0.05)]"
          style={{ fontFamily: serifSystem }}
        >
          Collections
        </p>

        <div className="relative mx-auto w-full max-w-screen-2xl">
          <p
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.24em] text-gold"
            style={{ fontFamily: monoSystem }}
          >
            <span className="h-px w-8 bg-gold" />
            Concept Builders · Curated Styles
          </p>

          <h1
            className="text-[clamp(52px,9vw,132px)] font-light leading-[0.9] tracking-[-0.03em]"
            style={{ fontFamily: serifSystem }}
          >
            Architectural
            <span className="block text-gold italic">Categories.</span>
          </h1>

          <p
            className="mt-7 max-w-[560px] text-[13px] leading-[1.85] text-cream-dim"
            style={{ fontFamily: monoSystem }}
          >
            Browse our architectural families and quickly narrow into the exact
            collection that matches your build goals.
          </p>
        </div>
      </section>

      <section className="sticky top-[73px] z-20 border-b border-[rgba(240,232,216,0.08)] bg-[rgba(10,9,7,0.95)] px-6 backdrop-blur-xl sm:px-10 lg:px-[60px]">
        <div className="mx-auto flex min-h-16 w-full max-w-screen-2xl flex-wrap items-center gap-3 py-3 lg:flex-nowrap lg:gap-0">
          <div
            className="pr-6 text-[11px] uppercase tracking-[0.14em] text-muted lg:border-r lg:border-[rgba(240,232,216,0.08)] lg:pr-8"
            style={{ fontFamily: monoSystem }}
          >
            <span className="text-gold">{totalCategories}</span> categories
          </div>

          <div className="flex flex-1 items-center gap-3 lg:pl-6">
            <div className="group relative w-full max-w-xl">
              <FiSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-gold"
                size={16}
              />
              <input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full border border-[rgba(240,232,216,0.18)] bg-[rgba(22,20,18,0.72)] py-2 pl-9 pr-3 text-[12px] tracking-[0.08em] text-cream outline-none placeholder:text-[rgba(168,152,128,0.9)] transition-all focus:border-[rgba(200,137,42,0.45)]"
                style={{ fontFamily: monoSystem }}
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="relative group">
                <select
                  value={categorySort}
                  onChange={(e) => setCategorySort(e.target.value)}
                  className="appearance-none border border-[rgba(240,232,216,0.1)] bg-[rgba(15,13,11,0.75)] pl-4 pr-10 py-2.5 text-[10px] uppercase tracking-[0.14em] text-cream outline-none focus:border-[rgba(200,137,42,0.45)] cursor-pointer"
                  style={{ fontFamily: monoSystem }}
                >
                  <option value="name">Name A–Z</option>
                  <option value="designs">Most Designs</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                  ▼
                </div>
              </div>

              <div className="flex items-center gap-1 border border-[rgba(240,232,216,0.1)] bg-[rgba(15,13,11,0.75)] p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`grid h-8 w-8 place-items-center transition-colors ${
                    viewMode === "grid"
                      ? "bg-[rgba(200,137,42,0.14)] text-gold"
                      : "text-muted hover:text-cream"
                  }`}
                  aria-label="Grid view"
                >
                  <FiGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`grid h-8 w-8 place-items-center transition-colors ${
                    viewMode === "list"
                      ? "bg-[rgba(200,137,42,0.14)] text-gold"
                      : "text-muted hover:text-cream"
                  }`}
                  aria-label="List view"
                >
                  <FiList size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-screen-2xl px-6 pb-20 pt-8 sm:px-10 lg:px-[60px]">
        {errorMessage && (
          <div className="border border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.08)] px-6 py-6 text-center">
            <p
              className="text-sm uppercase tracking-[0.18em] text-red-300"
              style={{ fontFamily: monoSystem }}
            >
              Error Loading Categories
            </p>
            <p className="mt-2 text-cream-dim">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-gold"
              style={{ fontFamily: monoSystem }}
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && !errorMessage && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <CgSpinner className="animate-spin text-gold" size={40} />
            <p className="text-cream-dim" style={{ fontFamily: monoSystem }}>
              Loading categories...
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && categories.length === 0 && (
          <div className="border border-[rgba(240,232,216,0.08)] bg-card/40 p-16 text-center">
            <h3
              className="text-4xl font-light text-cream"
              style={{ fontFamily: serifSystem }}
            >
              No categories found
            </h3>
            <p
              className="mt-3 text-[12px] tracking-[0.08em] text-muted"
              style={{ fontFamily: monoSystem }}
            >
              {searchQuery
                ? `No results for "${searchQuery}".`
                : "No categories are available yet."}
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && categories.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid grid-cols-1 gap-px bg-[rgba(240,232,216,0.08)]"
            }
          >
            {sortedCategories.map((category, index) => {
              const imageUrl = getCategoryImageUrl(category);
              const isFeatureHero = viewMode === "grid" && category.isFeatured && index === 0;

              if (viewMode === "list") {
                return (
                  <Link key={category.id} href={`/categories/${category.id}`} className="group flex flex-col bg-ink transition-colors duration-300 hover:bg-card sm:flex-row border border-cb-border hover:border-gold/30">
                    <div className="relative aspect-[16/8] overflow-hidden sm:aspect-auto sm:h-[220px] sm:w-[320px] bg-black/10">
                      <Image src={imageUrl} alt={category.name} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95" priority={index < 3} />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-gold font-medium" style={{ fontFamily: monoSystem }}>Category</p>
                        <h2 className="mb-3 text-3xl font-light text-cream transition-colors group-hover:text-gold-light" style={{ fontFamily: serifSystem }}>{category.name}</h2>
                        <p className="line-clamp-2 text-xs leading-[1.8] text-cream-dim font-light" style={{ fontFamily: monoSystem }}>{category.description || "Explore premium plans curated for this architectural category."}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-4">
                        <span className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium" style={{ fontFamily: monoSystem }}>{category._count?.designs || 0} designs</span>
                        <span className="text-[11px] uppercase tracking-[0.16em] text-cream-dim transition-colors group-hover:text-gold font-semibold" style={{ fontFamily: monoSystem }}>Explore →</span>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className={`group relative flex flex-col overflow-hidden border border-cb-border bg-[#13120E] transition-all duration-300 hover:border-gold/50 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(200,137,42,0.15)] ${isFeatureHero ? "sm:col-span-2 sm:row-span-2" : ""}`}
                >
                  <div className={`relative w-full overflow-hidden bg-black/25 ${isFeatureHero ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
                    <Image 
                      src={imageUrl} 
                      alt={category.name} 
                      fill 
                      sizes={isFeatureHero ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"} 
                      className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105" 
                      priority={index < 4} 
                    />
                    {category.isFeatured && (
                      <span className="absolute right-3 top-3 bg-gold px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-ink font-semibold" style={{ fontFamily: monoSystem }}>
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 justify-between min-h-[150px]">
                    <div>
                      <h2 
                        className={`font-light leading-tight text-cream transition-colors group-hover:text-gold-light line-clamp-1 mb-2 ${isFeatureHero ? "text-2xl sm:text-3xl" : "text-xl"}`} 
                        style={{ fontFamily: serifSystem }}
                      >
                        {category.name}
                      </h2>
                      <p 
                        className="line-clamp-2 text-xs leading-[1.75] text-cream-dim font-light mb-4"
                        style={{ fontFamily: monoSystem }}
                      >
                        {category.description || "Explore premium plans curated for this architectural category."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-4 mt-auto">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-gold font-medium" style={{ fontFamily: monoSystem }}>
                        {category._count?.designs || 0} Designs
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-cream-dim group-hover:text-gold transition-colors duration-300 font-semibold flex items-center gap-1" style={{ fontFamily: monoSystem }}>
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          categories.length > 0 &&
          totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent className="flex-wrap gap-2 justify-center">
                  <PaginationItem>
                    <PaginationFirst
                      onClick={() => handlePageChange(1)}
                      aria-disabled={currentPage === 1}
                      className={`cursor-pointer p-3 ${
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
                      className={`cursor-pointer p-3 ${
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
                          <PaginationEllipsis className="p-3" />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={currentPage === page}
                          className={`cursor-pointer min-w-[2.5rem] ${
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
                      className={`cursor-pointer p-3 ${
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
                      className={`cursor-pointer p-3 ${
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
