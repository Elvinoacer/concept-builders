"use client";

import { useEffect, useMemo, useRef } from "react";
import { preload } from "swr";
import useSWRInfinite from "swr/infinite";

import DesignCard from "./DesignCard";

type DesignCardType = {
  id: string;
  name: string;
  basePrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  views: number;
  isFeatured: boolean;
  category: { id: string; name: string } | null;
  images: Array<{ url: string; name: string; type: string }>;
  files?: Array<{ url: string; name: string; type: string }>;
};

type PageResponse = {
  designs: DesignCardType[];
  nextCursor: string | null;
  hasMore: boolean;
  totalDesigns?: number;
};

interface PublicDesignsInfiniteGridProps {
  search?: string;
  category?: string;
  sort?: string;
  isFeatured?: boolean;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  minSize?: string;
  maxSize?: string;
  priceType?: string;
  fallbackImage: string;
  /** Optional total from server-side count for discovery copy */
  totalDesignsHint?: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch designs: ${response.status}`);
  }
  return response.json();
};

const sortMap: Record<string, string | undefined> = {
  "price-asc": "Price (Low to High)",
  "price-desc": "Price (High to Low)",
  newest: "Newest",
  name: undefined,
};

export default function PublicDesignsInfiniteGrid({
  search,
  category,
  sort,
  isFeatured,
  minPrice,
  maxPrice,
  bedrooms,
  minSize,
  maxSize,
  priceType,
  fallbackImage,
  totalDesignsHint,
}: PublicDesignsInfiniteGridProps) {
  const normalizedSort = sortMap[sort || "name"];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const getKey = (pageIndex: number, previousPageData: PageResponse | null) => {
    if (previousPageData && !previousPageData.nextCursor) return null;

    const params = new URLSearchParams();
    params.set("limit", "12");
    params.set("mode", "cursor");
    // First page includes totals so we can show "X of Y"
    params.set("includeTotals", pageIndex === 0 ? "true" : "false");
    params.set("lite", "true");
    if (search) params.set("search", search);
    if (category && category !== "All") {
      params.set("styles", category);
    }
    if (normalizedSort) {
      params.set("sortBy", normalizedSort);
    }
    if (isFeatured) {
      params.set("isFeatured", "true");
    }
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms && bedrooms !== "Any") params.set("bedrooms", bedrooms);
    if (minSize) params.set("minSize", minSize);
    if (maxSize) params.set("maxSize", maxSize);
    if (priceType) params.set("priceType", priceType);
    if (pageIndex > 0 && previousPageData?.nextCursor) {
      params.set("cursor", previousPageData.nextCursor);
    }

    return `/api/designs?${params.toString()}`;
  };

  const { data, error, isLoading, size, setSize, isValidating } =
    useSWRInfinite<PageResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      keepPreviousData: true,
      dedupingInterval: 10_000,
    });

  const designs = useMemo(
    () => (data ? data.flatMap((page) => page.designs) : []),
    [data],
  );

  const hasMore = data?.[data.length - 1]?.nextCursor != null;
  const totalDesigns =
    data?.[0]?.totalDesigns ?? totalDesignsHint ?? undefined;

  // Prefetch detail API when cards approach viewport
  useEffect(() => {
    if (!designs.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const designId = entry.target.getAttribute("data-design-id");
          if (!designId) return;
          preload(`/api/designs/${designId}`, fetcher);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "200px" },
    );

    const cards = document.querySelectorAll("[data-design-id]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [designs]);

  // Infinite scroll near bottom
  useEffect(() => {
    if (!hasMore || isValidating) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSize((s) => s + 1);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isValidating, setSize, designs.length]);

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[16/13] animate-pulse border border-cb-border bg-card/30"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-[rgba(240,232,216,0.08)] bg-card/40 p-16 text-center">
        <h3 className="mb-2 text-4xl font-light text-cream">
          Unable to load designs
        </h3>
        <p className="text-[12px] tracking-[0.08em] text-muted">
          Please refresh and try again.
        </p>
      </div>
    );
  }

  if (!designs.length) {
    return (
      <div className="border border-[rgba(240,232,216,0.08)] bg-card/40 p-16 text-center">
        <h3 className="mb-2 text-4xl font-light text-cream">No designs found</h3>
        <p className="text-[12px] tracking-[0.08em] text-muted">
          Adjust the category, featured toggle, or search phrase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[rgba(240,232,216,0.08)] pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream-dim">
          Showing{" "}
          <span className="text-gold">{designs.length}</span>
          {typeof totalDesigns === "number" && totalDesigns > 0 ? (
            <>
              {" "}
              of <span className="text-cream">{totalDesigns}</span> designs
            </>
          ) : (
            <> designs</>
          )}
          {hasMore ? " · scroll for more" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {designs.map((design, index) => {
          return (
            <article key={design.id} data-design-id={design.id}>
              <DesignCard
                design={{
                  ...design,
                  images:
                    (design.images && design.images.length > 0) ||
                    (design.files && design.files.length > 0)
                      ? design.images
                      : [
                          {
                            url: fallbackImage,
                            name: "Fallback",
                            type: "IMAGE",
                          },
                        ],
                }}
                index={index}
                priceType={priceType}
              />
            </article>
          );
        })}
      </div>

      <div ref={loadMoreRef} className="h-4 w-full" aria-hidden />

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-[rgba(200,137,42,0.15)] disabled:opacity-60"
          >
            {isValidating ? "Loading..." : "Load more designs"}
          </button>
        </div>
      )}

      {!hasMore && designs.length > 0 && (
        <p className="pb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          You&apos;ve seen every plan in this view
        </p>
      )}
    </div>
  );
}
