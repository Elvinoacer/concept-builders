"use client";

import { useMemo } from "react";
import {
  ArrowDown,
  Check,
  LoaderCircle,
  RotateCcw,
  Search,
  TriangleAlert,
} from "lucide-react";
import useSWRInfinite from "swr/infinite";
import DesignCard from "./DesignCard";
import DesignCardSkeleton from "./DesignCardSkeleton";
import styles from "./designs.module.css";

type DesignCardType = {
  id: string;
  name: string;
  basePrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  floors?: number | null;
  minBuildingCost?: number | null;
  maxBuildingCost?: number | null;
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
  totalDesignsHint?: number;
  view?: "gallery" | "list";
  onClearFilters?: () => void;
}
const fetcher = async (url: string): Promise<PageResponse> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok)
    throw new Error(`Failed to fetch designs: ${response.status}`);
  return response.json();
};
const sortMap: Record<string, string> = {
  "price-asc": "Price (Low to High)",
  "price-desc": "Price (High to Low)",
  newest: "Newest",
  featured: "Featured",
  popular: "Popular",
  name: "Name",
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
  view = "gallery",
  onClearFilters,
}: PublicDesignsInfiniteGridProps) {
  const getKey = (pageIndex: number, previousPageData: PageResponse | null) => {
    if (previousPageData && !previousPageData.nextCursor) return null;
    const params = new URLSearchParams({
      limit: "12",
      mode: "cursor",
      lite: "true",
      includeTotals: pageIndex === 0 ? "true" : "false",
      sortBy: sortMap[sort || "featured"] || "Featured",
    });
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("styles", category);
    if (isFeatured) params.set("isFeatured", "true");
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (minSize) params.set("minSize", minSize);
    if (maxSize) params.set("maxSize", maxSize);
    if (priceType) params.set("priceType", priceType);
    if (pageIndex > 0 && previousPageData?.nextCursor)
      params.set("cursor", previousPageData.nextCursor);
    return `/api/designs?${params}`;
  };
  const { data, error, isLoading, size, setSize, isValidating, mutate } =
    useSWRInfinite<PageResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
      keepPreviousData: false,
      dedupingInterval: 10_000,
    });
  const designs = useMemo(
    () =>
      Array.from(
        new Map(
          (data || [])
            .flatMap((page) => page.designs)
            .map((design) => [design.id, design]),
        ).values(),
      ),
    [data],
  );
  const hasMore = Boolean(data?.[data.length - 1]?.nextCursor);
  const totalDesigns = data?.[0]?.totalDesigns ?? totalDesignsHint;
  const loadingMore =
    !error &&
    (isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"));
  const gridClass = `${styles.designGrid} ${view === "list" ? styles.listGrid : ""}`;

  if (isLoading && !data && !error)
    return (
      <div role="status" aria-label="Loading house plans">
        <div className={styles.resultsMeta}>Finding your next beginning…</div>
        <div className={gridClass}>
          {Array.from({ length: 6 }, (_, index) => (
            <DesignCardSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    );
  if (error && !designs.length)
    return (
      <div className={styles.emptyState} role="alert">
        <span className={styles.emptyIcon}>
          <TriangleAlert size={24} strokeWidth={1.4} aria-hidden="true" />
        </span>
        <h3>A small pause in the plans.</h3>
        <p>
          We couldn&apos;t load the collection. Please try again in a moment.
        </p>
        <button
          type="button"
          className={styles.outlineButton}
          onClick={() => void mutate()}
          disabled={isValidating}
        >
          {isValidating ? (
            <LoaderCircle size={15} className={styles.spin} />
          ) : (
            <RotateCcw size={15} />
          )}{" "}
          Try again
        </button>
      </div>
    );
  if (!designs.length)
    return (
      <div className={styles.emptyState} role="status">
        <span className={styles.emptyIcon}>
          <Search size={24} strokeWidth={1.4} aria-hidden="true" />
        </span>
        <h3>Your home is still out there.</h3>
        <p>
          No plans match this combination just yet. Try a broader search or
          remove a filter to see more possibilities.
        </p>
        {onClearFilters && (
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClearFilters}
          >
            Reset filters <RotateCcw size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  return (
    <div aria-busy={Boolean(loadingMore)}>
      <div className={styles.resultsMeta} role="status" aria-live="polite">
        <p>
          <strong>
            {typeof totalDesigns === "number"
              ? totalDesigns.toLocaleString()
              : designs.length.toLocaleString()}
          </strong>{" "}
          {totalDesigns === 1 ? "plan" : "plans"}{" "}
          {search ||
          category ||
          bedrooms ||
          isFeatured ||
          minPrice ||
          maxPrice ||
          minSize ||
          maxSize
            ? "matching your vision"
            : "ready for your next chapter"}
        </p>
        <span>
          <Check size={12} aria-hidden="true" /> Thoughtfully designed. Yours to
          make home.
        </span>
      </div>
      <div className={gridClass}>
        {designs.map((design, index) => (
          <article key={design.id} data-design-id={design.id}>
            <DesignCard
              design={{
                ...design,
                images:
                  design.images?.length || design.files?.length
                    ? design.images
                    : [
                        {
                          url: fallbackImage,
                          name: "House plan",
                          type: "IMAGE",
                        },
                      ],
              }}
              index={index}
              priceType={priceType}
            />
          </article>
        ))}
      </div>
      {error && (
        <div className={styles.inlineError} role="alert">
          The next plans couldn&apos;t load.
          <button type="button" onClick={() => void mutate()}>
            Try again
          </button>
        </div>
      )}
      <div className={styles.loadMore}>
        <p role="status" aria-live="polite">
          You&apos;ve explored {designs.length}
          {typeof totalDesigns === "number"
            ? ` of ${totalDesigns.toLocaleString()}`
            : ""}{" "}
          plans
        </p>
        {typeof totalDesigns === "number" && totalDesigns > 0 && (
          <progress
            className={styles.loadProgress}
            value={designs.length}
            max={totalDesigns}
            aria-label="House plans explored"
          />
        )}
        {hasMore ? (
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() =>
              void (error ? mutate() : setSize((previous) => previous + 1))
            }
            disabled={Boolean(isValidating || loadingMore)}
          >
            {loadingMore ? (
              <>
                <LoaderCircle
                  size={15}
                  className={styles.spin}
                  aria-hidden="true"
                />{" "}
                Bringing you more plans…
              </>
            ) : (
              <>
                Explore more plans <ArrowDown size={15} aria-hidden="true" />
              </>
            )}
          </button>
        ) : (
          <p>You&apos;re all caught up. Your next chapter is waiting.</p>
        )}
      </div>
    </div>
  );
}
