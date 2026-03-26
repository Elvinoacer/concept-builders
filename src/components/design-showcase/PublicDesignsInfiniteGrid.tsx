"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { preload } from "swr";
import useSWRInfinite from "swr/infinite";

type DesignCard = {
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
  designs: DesignCard[];
  nextCursor: string | null;
  hasMore: boolean;
};

interface PublicDesignsInfiniteGridProps {
  search?: string;
  category?: string;
  sort?: string;
  isFeatured?: boolean;
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
  fallbackImage,
}: PublicDesignsInfiniteGridProps) {
  const normalizedSort = sortMap[sort || "name"];

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
      <div className="grid grid-cols-1 gap-px bg-[rgba(240,232,216,0.08)] md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-[440px] animate-pulse bg-card" />
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
      <div className="grid grid-cols-1 gap-px bg-[rgba(240,232,216,0.08)] md:grid-cols-2 xl:grid-cols-3">
        {designs.map((design, index) => {
          const imageUrl = design.images?.[0]?.url || fallbackImage;

          return (
            <article
              key={design.id}
              data-design-id={design.id}
              className="group bg-ink transition-colors duration-300 hover:bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={design.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                {design.isFeatured && (
                  <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-ink">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                    {design.category?.name || "Uncategorized"}
                  </p>
                  <p className="text-[10px] tracking-[0.1em] text-muted">
                    {(design.views || 0).toLocaleString()} views
                  </p>
                </div>

                <h3 className="mb-3 line-clamp-1 text-3xl font-light text-cream transition-colors group-hover:text-gold-light">
                  {design.name}
                </h3>

                <div className="mb-5 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.12em] text-muted">
                  <span>{design.bedrooms ?? "-"} Beds</span>
                  <span>{design.bathrooms ?? "-"} Baths</span>
                  <span>{design.area ?? "-"} m2</span>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-4">
                  <p className="text-2xl font-light text-cream">
                    <span className="mr-1 text-[10px] uppercase tracking-[0.15em] text-muted">
                      from
                    </span>
                    ${design.basePrice.toLocaleString()}
                  </p>
                  <Link
                    href={`/designs/${design.id}`}
                    className="text-[10px] uppercase tracking-[0.16em] text-cream-dim transition-colors group-hover:text-gold"
                  >
                    View Plan
                  </Link>
                </div>
              </div>
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
    </div>
  );
}
