"use client";

import { useEffect, useMemo, useState } from "react";
import { preload } from "swr";
import useSWRInfinite from "swr/infinite";

import DesignCard from "./DesignCard";
import DesignPreviewModal from "./DesignPreviewModal";

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
};

type PageResponse = {
  designs: DesignCardType[];
  nextCursor: string | null;
  hasMore: boolean;
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
}: PublicDesignsInfiniteGridProps) {
  const normalizedSort = sortMap[sort || "name"];
  
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  const getKey = (pageIndex: number, previousPageData: PageResponse | null) => {
    if (previousPageData && !previousPageData.nextCursor) return null;

    const params = new URLSearchParams();
    params.set("limit", "9");
    params.set("mode", "cursor");
    params.set("includeTotals", "false");
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

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[16/13] animate-pulse bg-card/30 border border-cb-border" />
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
        <h3 className="mb-2 text-4xl font-light text-cream">
          No designs found
        </h3>
        <p className="text-[12px] tracking-[0.08em] text-muted">
          Adjust the category, featured toggle, or search phrase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {designs.map((design, index) => {
          return (
            <article
              key={design.id}
              data-design-id={design.id}
            >
              <DesignCard 
                design={{
                  ...design,
                  images: (design.images && design.images.length > 0)
                    ? design.images
                    : [{ url: fallbackImage, type: "image/webp" }]
                } as any} 
                index={index} 
                priceType={priceType} 
                onCardClick={setSelectedDesignId}
              />
            </article>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-[rgba(200,137,42,0.15)] disabled:opacity-60"
          >
            {isValidating ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <DesignPreviewModal id={selectedDesignId} onClose={() => setSelectedDesignId(null)} />
    </div>
  );
}
