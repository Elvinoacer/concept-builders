"use client";

import DesignCard from "@/components/design-showcase/DesignCard";
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
import Link from "next/link";
import { FiAlertTriangle, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Design {
  id: string;
  name: string;
  description: string;
  images: { url: string; type: string }[];
  isFeatured: boolean;
  reviews: any[];
  discounts: any[];
  basePrice: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  designs: Design[];
  image?: string;
  _count: {
    designs: number;
  };
}

interface CategoryPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams.search || "";

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${params.id}?page=${page}&search=${search}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch category");
        }
        const data = await res.json();
        setCategory(data);
      } catch (error) {
        setError("Failed to load category. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [params.id, page, search]);

  const totalPages = category ? Math.ceil(category._count.designs / 10) : 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.set("page", "1");
    window.location.href = url.toString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-12 h-12 xs:w-16 xs:h-16 border-4 border-gold border-dashed rounded-full animate-spin"></div>
        <p className="mt-3 xs:mt-4 text-base xs:text-lg text-cream-dim">
          Loading category...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-ink text-center px-4 xs:px-6">
        <div className="bg-card border border-cb-border p-6 xs:p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-4 xs:mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
            <FiAlertTriangle
              size={32}
              className="xs:w-10 xs:h-10 text-destructive"
            />
          </div>
          <h1 className="text-2xl xs:text-3xl font-bold text-cream mb-2 xs:mb-3">
            An Error Occurred
          </h1>
          <p className="text-cream-dim text-sm xs:text-base mb-6 xs:mb-8">
            {error}
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-6 xs:px-8 py-2.5 xs:py-3 bg-gold hover:bg-gold-light text-ink rounded-lg transition-all duration-300 shadow-md text-sm xs:text-base w-full font-semibold"
          >
            Explore Other Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-ink text-center px-4 xs:px-6">
        <div className="bg-card border border-cb-border p-6 xs:p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-4 xs:mb-6 bg-surface rounded-full flex items-center justify-center">
            <FiAlertTriangle
              size={32}
              className="xs:w-10 xs:h-10 text-muted"
            />
          </div>
          <h1 className="text-2xl xs:text-3xl font-bold text-cream mb-2 xs:mb-3">
            Category Not Found
          </h1>
          <p className="text-cream-dim text-sm xs:text-base mb-6 xs:mb-8">
            The category you are looking for does not exist or may have been
            moved.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-6 xs:px-8 py-2.5 xs:py-3 bg-gold hover:bg-gold-light text-ink rounded-lg transition-all duration-300 shadow-md text-sm xs:text-base w-full font-semibold"
          >
            Explore Other Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink min-h-screen">
      {/* Header Section */}
      <header className="relative h-40 xs:h-48 sm:h-56 md:h-64 rounded-b-2xl flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src={category.image || "/images/banners/banner2.jpg"}
          alt={category.name}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {category.name} Designs
          </h1>
          {category.description && (
            <p className="text-sm xs:text-base sm:text-lg mt-2 xs:mt-3 opacity-90 max-w-2xl mx-auto hidden xs:block">
              {category.description}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Search and Info Section */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-4 xs:gap-6 mb-6 sm:mb-8">
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md xs:max-w-lg"
          >
            <div className="relative">
              <FiSearch
                className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 text-muted z-10"
                size={18}
              />
              <input
                type="search"
                name="search"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 xs:pl-12 pr-4 py-2.5 xs:py-3 text-sm xs:text-base border border-cb-border bg-surface rounded-xl xs:rounded-2xl shadow-sm focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 text-cream placeholder:text-muted"
                placeholder={`Search in ${category.name}...`}
              />
            </div>
          </form>

          {/* Design Count */}
          <div className="flex items-center justify-between xs:justify-end gap-4">
            <p className="text-sm xs:text-base text-cream-dim font-medium whitespace-nowrap">
              {category._count.designs} design
              {category._count.designs !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 lg:gap-8">
          {category.designs.length === 0 ? (
            <div className="text-center text-muted col-span-full py-12 xs:py-16">
              <div className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
                <FiSearch
                  size={24}
                  className="text-muted"
                />
              </div>
              <h3 className="text-lg xs:text-xl font-semibold text-cream mb-2">
                No designs found
              </h3>
              <p className="text-sm xs:text-base max-w-sm mx-auto text-cream-dim">
                {search
                  ? `No results for "${search}" in ${category.name}. Try different keywords.`
                  : `No designs available in ${category.name} yet.`}
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    const url = new URL(window.location.href);
                    url.searchParams.delete("search");
                    window.location.href = url.toString();
                  }}
                  className="mt-4 px-4 py-2 bg-gold hover:bg-gold-light text-ink rounded-lg transition-colors text-sm font-semibold"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            category.designs.map((design: Design, index: number) => (
              <DesignCard key={design.id} design={design} index={index} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && category && totalPages > 1 && (
          <div className="mt-8 xs:mt-10 sm:mt-12">
            <Pagination>
              <PaginationContent className="flex-wrap gap-1 xs:gap-2 justify-center">
                <PaginationItem>
                  <Link
                    href={`/categories/${params.id}?page=1${search ? `&search=${search}` : ""}`}
                  >
                    <PaginationFirst
                      aria-disabled={page === 1}
                      className={`text-xs xs:text-sm p-2 xs:p-3 ${
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface cursor-pointer"
                      }`}
                    />
                  </Link>
                </PaginationItem>
                <PaginationItem>
                  <Link
                    href={`/categories/${params.id}?page=${page - 1}${search ? `&search=${search}` : ""}`}
                  >
                    <PaginationPrevious
                      aria-disabled={page === 1}
                      className={`text-xs xs:text-sm p-2 xs:p-3 ${
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface cursor-pointer"
                      }`}
                    />
                  </Link>
                </PaginationItem>

                {getPaginationRange(page, totalPages).map((p, index) => {
                  if (p === "...") {
                    return (
                      <PaginationItem key={index}>
                        <PaginationEllipsis className="p-2 xs:p-3 text-xs xs:text-sm" />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={p}>
                      <Link
                        href={`/categories/${params.id}?page=${p}${search ? `&search=${search}` : ""}`}
                      >
                        <PaginationLink
                          isActive={page === p}
                          className={`text-xs xs:text-sm min-w-[2rem] xs:min-w-[2.5rem] ${
                            page === p
                              ? "bg-gold text-ink"
                              : "hover:bg-surface text-cream-dim hover:text-cream cursor-pointer"
                          }`}
                        >
                          {p}
                        </PaginationLink>
                      </Link>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <Link
                    href={`/categories/${params.id}?page=${page + 1}${search ? `&search=${search}` : ""}`}
                  >
                    <PaginationNext
                      aria-disabled={page === totalPages}
                      className={`text-xs xs:text-sm p-2 xs:p-3 ${
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface cursor-pointer"
                      }`}
                    />
                  </Link>
                </PaginationItem>
                <PaginationItem>
                  <Link
                    href={`/categories/${params.id}?page=${totalPages}${search ? `&search=${search}` : ""}`}
                  >
                    <PaginationLast
                      aria-disabled={page === totalPages}
                      className={`text-xs xs:text-sm p-2 xs:p-3 ${
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface cursor-pointer"
                      }`}
                    />
                  </Link>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}

function getPaginationRange(currentPage: number, totalPages: number) {
  // Responsive pagination range based on screen size
  const maxVisiblePages =
    typeof window !== "undefined"
      ? window.innerWidth < 640
        ? 3
        : window.innerWidth < 1024
          ? 5
          : 7
      : 5; // Default for SSR

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
}
