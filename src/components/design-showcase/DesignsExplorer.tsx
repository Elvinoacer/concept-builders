"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowUpRight,
  BedDouble,
  Check,
  ChevronDown,
  House,
  LayoutGrid,
  List,
  Ruler,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PublicDesignsInfiniteGrid from "./PublicDesignsInfiniteGrid";
import styles from "./designs.module.css";

type FilterUpdates = Record<string, string | undefined>;
type FilterChip = { label: string; updates: FilterUpdates };

type Category = { id: string; name: string; image?: string | null };
const emptySearchParams = new URLSearchParams();
const categoryOrder = [
  "Bungalows",
  "Maisonettes",
  "Villas",
  "Apartments",
  "Townhouses",
  "Cottages",
];
const categoryImages: Record<string, string> = {
  Bungalows: "/images/landing/courtyard-bungalow.webp",
  Maisonettes: "/images/landing/contemporary-villa.webp",
  Villas: "/images/landing/cb3023-arrival.webp",
  Apartments: "/images/landing/urban-apartment.webp",
};
const fetchCategories = async (url: string): Promise<Category[]> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error("Unable to load styles");
  return response.json();
};

const areaOptions = [
  { label: "Any floor area", value: "" },
  { label: "Under 100 m²", value: ":100" },
  { label: "100 – 200 m²", value: "100:200" },
  { label: "200 – 300 m²", value: "200:300" },
  { label: "300 m² and above", value: "300:" },
];

function positiveNumber(value: string | null) {
  return value && Number.isFinite(Number(value)) && Number(value) >= 0
    ? value
    : undefined;
}

export default function DesignsExplorer() {
  const {
    data: categoryData,
    error: categoryError,
    mutate: retryCategories,
  } = useSWR<Category[]>("/api/categories?forFilters=true", fetchCategories, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  const categories = useMemo(
    () =>
      [...(categoryData || [])].sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a.name);
        const bIndex = categoryOrder.indexOf(b.name);
        return (
          (aIndex < 0 ? categoryOrder.length : aIndex) -
            (bIndex < 0 ? categoryOrder.length : bIndex) ||
          a.name.localeCompare(b.name)
        );
      }),
    [categoryData],
  );
  const searchParams = useSearchParams() ?? emptySearchParams;
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"gallery" | "list">("gallery");
  const category = searchParams.get("category") || undefined;
  const visualCategories = categories.filter(
    (item) => item.image || categoryImages[item.name] || item.name === category,
  );
  const search = searchParams.get("search")?.trim() || undefined;
  const bedroomsParam = searchParams.get("bedrooms");
  const bedrooms =
    bedroomsParam && /^(\d+|4\+)$/.test(bedroomsParam)
      ? bedroomsParam
      : undefined;
  const sortParam = searchParams.get("sort") || "featured";
  const sort = [
    "featured",
    "newest",
    "popular",
    "name",
    "price-asc",
    "price-desc",
  ].includes(sortParam)
    ? sortParam
    : "featured";
  const isFeatured = searchParams.get("isFeatured") === "true";
  const minPrice = positiveNumber(searchParams.get("minPrice"));
  const maxPrice = positiveNumber(searchParams.get("maxPrice"));
  const minSize = positiveNumber(searchParams.get("minSize"));
  const maxSize = positiveNumber(searchParams.get("maxSize"));
  const priceType =
    searchParams.get("priceType") === "building" ? "building" : "design";
  const areaValue =
    minSize || maxSize ? `${minSize || ""}:${maxSize || ""}` : "";
  const rangeKey = `${priceType}:${minPrice || ""}:${maxPrice || ""}`;

  function updateFilters(updates: FilterUpdates) {
    // Read the latest URL so consecutive clicks compose even while React is
    // finishing the previous filter transition.
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    params.delete("pageSize");
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    // Next synchronises native history with useSearchParams without re-fetching
    // the server-rendered introduction and category list on every filter change.
    startTransition(() =>
      window.history.pushState(
        null,
        "",
        `/designs${params.size ? `?${params}` : ""}`,
      ),
    );
  }

  function clearFilters() {
    startTransition(() => window.history.pushState(null, "", "/designs"));
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("search") || "",
    ).trim();
    updateFilters({ search: value || undefined });
  }

  const chips: FilterChip[] = [];
  if (search)
    chips.push({ label: `“${search}”`, updates: { search: undefined } });
  if (category && category !== "All")
    chips.push({ label: category, updates: { category: undefined } });
  if (bedrooms)
    chips.push({
      label: `${bedrooms} bedroom${bedrooms === "1" ? "" : "s"}`,
      updates: { bedrooms: undefined },
    });
  if (minSize || maxSize)
    chips.push({
      label:
        minSize && maxSize
          ? `${minSize} – ${maxSize} m²`
          : minSize
            ? `${minSize}+ m²`
            : `Up to ${maxSize} m²`,
      updates: { minSize: undefined, maxSize: undefined },
    });
  if (minPrice || maxPrice)
    chips.push({
      label: `${priceType === "building" ? "Build" : "Plan"}: ${minPrice ? `$${Number(minPrice).toLocaleString()}` : "$0"}${maxPrice ? ` – $${Number(maxPrice).toLocaleString()}` : "+"}`,
      updates: { minPrice: undefined, maxPrice: undefined },
    });
  if (isFeatured)
    chips.push({ label: "Featured plans", updates: { isFeatured: undefined } });

  function renderFilters(mobile = false) {
    const prefix = mobile ? "mobile" : "desktop";
    return (
      <div className={styles.filterFields}>
        <fieldset className={styles.filterGroup}>
          <legend>
            <BedDouble size={16} aria-hidden="true" /> Bedrooms
          </legend>
          <p>Room for everyone.</p>
          <div className={styles.bedroomOptions}>
            {["", "1", "2", "3", "4+"].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={(bedrooms || "") === value}
                onClick={() => updateFilters({ bedrooms: value || undefined })}
              >
                {value || "Any"}
              </button>
            ))}
          </div>
          {bedrooms && !["1", "2", "3", "4+"].includes(bedrooms) && (
            <span className={styles.rangeHint}>
              {bedrooms} bedrooms selected
            </span>
          )}
        </fieldset>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor={`${prefix}-style`}>
            <House size={16} aria-hidden="true" /> Home style
          </label>
          <p>Explore every architectural direction.</p>
          <div className={styles.selectWrap}>
            <select
              id={`${prefix}-style`}
              value={category || ""}
              onChange={(event) =>
                updateFilters({ category: event.target.value || undefined })
              }
            >
              <option value="">All styles</option>
              {categories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
              {category &&
                !categories.some((item) => item.name === category) && (
                  <option value={category}>{category}</option>
                )}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor={`${prefix}-area`}>
            <Ruler size={16} aria-hidden="true" /> Floor area
          </label>
          <p>Find the right footprint.</p>
          <div className={styles.selectWrap}>
            <select
              id={`${prefix}-area`}
              value={areaValue}
              onChange={(event) => {
                const [min, max] = event.target.value.split(":");
                updateFilters({
                  minSize: min || undefined,
                  maxSize: max || undefined,
                });
              }}
            >
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {areaValue &&
                !areaOptions.some((option) => option.value === areaValue) && (
                  <option value={areaValue}>
                    {minSize || "0"} – {maxSize || "any"} m²
                  </option>
                )}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </div>
        </div>
        <form
          key={`${prefix}-${rangeKey}`}
          className={styles.filterGroup}
          onInput={(event) =>
            (
              event.currentTarget.elements.namedItem(
                "maxPrice",
              ) as HTMLInputElement
            ).setCustomValidity("")
          }
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const min = String(data.get("minPrice") || "");
            const max = String(data.get("maxPrice") || "");
            const maxInput = form.elements.namedItem(
              "maxPrice",
            ) as HTMLInputElement;
            maxInput.setCustomValidity(
              min && max && Number(min) > Number(max)
                ? "Maximum must be at least the minimum."
                : "",
            );
            if (!form.reportValidity()) return;
            updateFilters({
              minPrice: min || undefined,
              maxPrice: max || undefined,
            });
          }}
        >
          <span className={styles.filterLabel}>
            <SlidersHorizontal size={16} aria-hidden="true" /> Your budget
          </span>
          <p>A comfortable place to start.</p>
          <div
            className={styles.budgetType}
            role="group"
            aria-label="Budget type"
          >
            <button
              type="button"
              aria-pressed={priceType === "design"}
              onClick={() =>
                updateFilters({
                  priceType: undefined,
                  minPrice: undefined,
                  maxPrice: undefined,
                })
              }
            >
              Plan price
            </button>
            <button
              type="button"
              aria-pressed={priceType === "building"}
              onClick={() =>
                updateFilters({
                  priceType: "building",
                  minPrice: undefined,
                  maxPrice: undefined,
                })
              }
            >
              Build estimate
            </button>
          </div>
          <div className={styles.priceInputs}>
            <label htmlFor={`${prefix}-min`}>
              Min (USD)
              <input
                id={`${prefix}-min`}
                name="minPrice"
                type="number"
                min="0"
                step="any"
                placeholder="No min"
                defaultValue={minPrice || ""}
              />
            </label>
            <span aria-hidden="true">–</span>
            <label htmlFor={`${prefix}-max`}>
              Max (USD)
              <input
                id={`${prefix}-max`}
                name="maxPrice"
                type="number"
                min="0"
                step="any"
                placeholder="No max"
                defaultValue={maxPrice || ""}
                onInput={(event) => event.currentTarget.setCustomValidity("")}
              />
            </label>
          </div>
          <button type="submit" className={styles.applyBudget}>
            Apply budget <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </form>
        <div className={styles.filterGroup}>
          <button
            type="button"
            className={styles.featuredToggle}
            aria-pressed={isFeatured}
            onClick={() =>
              updateFilters({ isFeatured: isFeatured ? undefined : "true" })
            }
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>Featured plans only</span>
            <span className={styles.checkbox}>
              {isFeatured && <Check size={12} aria-hidden="true" />}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      className={styles.explorer}
      id="plans-grid"
      aria-label="Explore house plans"
      aria-busy={isPending}
    >
      <div className={styles.collectionTopline}>
        <div>
          <p className={styles.eyebrow}>
            <span className={styles.shortRule} /> Spaces for every story
          </p>
          <h2>
            Find your <em>kind of home.</em>
          </h2>
        </div>
        <p className={styles.collectionNote}>
          Start with a style. Follow a feeling.
          <br />
          Make room for what matters to you.
        </p>
      </div>
      <div
        className={styles.categoryTabs}
        role="group"
        aria-label="House plan style"
      >
        <button
          type="button"
          aria-pressed={!category || category === "All"}
          onClick={() => updateFilters({ category: undefined })}
          className={styles.allPlansCategory}
        >
          <span className={styles.allPlansIcon}>
            <House size={28} strokeWidth={1} aria-hidden="true" />
          </span>
          <span className={styles.categoryName}>
            All plans <ArrowUpRight size={17} aria-hidden="true" />
          </span>
          <span className={styles.categorySubtitle}>
            Every possibility, in one place.
          </span>
        </button>
        {visualCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.name}
            onClick={() => updateFilters({ category: item.name })}
            data-photographic={Boolean(item.image || categoryImages[item.name])}
          >
            {item.image || categoryImages[item.name] ? (
              <Image
                src={item.image || categoryImages[item.name]}
                alt=""
                fill
                sizes="(max-width: 767px) 180px, 250px"
              />
            ) : (
              <span className={styles.allPlansIcon}>
                <House size={28} strokeWidth={1} aria-hidden="true" />
              </span>
            )}
            <span className={styles.categoryName}>
              {item.name} <ArrowUpRight size={17} aria-hidden="true" />
            </span>
            <span className={styles.categorySubtitle}>
              {category === item.name
                ? "Exploring this style"
                : "Explore the possibilities"}
            </span>
            {category === item.name && (
              <span className={styles.categorySelected}>
                <Check size={13} aria-hidden="true" />
                <span className={styles.srOnly}>Selected</span>
              </span>
            )}
          </button>
        ))}
        {category &&
          category !== "All" &&
          !categories.some((item) => item.name === category) && (
            <button
              type="button"
              aria-pressed="true"
              onClick={() => updateFilters({ category: undefined })}
            >
              {category} <X size={12} aria-hidden="true" />
            </button>
          )}
        {categoryError && (
          <button type="button" onClick={() => void retryCategories()}>
            Reload styles
          </button>
        )}
      </div>
      <div className={styles.discoveryLayout}>
        <div className={styles.results}>
          <div className={styles.toolbar}>
            <form
              key={search || ""}
              role="search"
              onSubmit={handleSearch}
              className={styles.searchForm}
            >
              <Search size={17} aria-hidden="true" />
              <input
                name="search"
                aria-label="Search house plans"
                placeholder="Search by name, style, or plan code…"
                defaultValue={search || ""}
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => updateFilters({ search: undefined })}
                >
                  <X size={15} />
                </button>
              )}
              <button
                type="submit"
                className={styles.searchSubmit}
                aria-label="Submit search"
              >
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </form>
            <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DialogTrigger asChild>
                <button type="button" className={styles.filterButton}>
                  <SlidersHorizontal size={17} aria-hidden="true" /> Filters{" "}
                  {chips.length > 0 && <span>{chips.length}</span>}
                </button>
              </DialogTrigger>
              <DialogContent
                className={styles.filterDialog}
                overlayClassName={styles.filterDialogOverlay}
              >
                <DialogTitle className={styles.dialogTitle}>
                  Find your fit
                </DialogTitle>
                <DialogDescription className={styles.dialogDescription}>
                  A few details to bring you closer to home.
                </DialogDescription>
                {renderFilters(true)}
                <div className={styles.dialogActions}>
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={clearFilters}
                  >
                    Reset filters
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => setFiltersOpen(false)}
                  >
                    Show plans <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
            <div className={`${styles.selectWrap} ${styles.sortSelect}`}>
              <label htmlFor="design-sort" className={styles.srOnly}>
                Sort house plans
              </label>
              <select
                id="design-sort"
                value={sort}
                onChange={(event) =>
                  updateFilters({ sort: event.target.value })
                }
              >
                <option value="featured">Featured first</option>
                <option value="newest">Newest first</option>
                <option value="popular">Most popular</option>
                <option value="name">Name: A to Z</option>
                <option value="price-asc">Plan price: low to high</option>
                <option value="price-desc">Plan price: high to low</option>
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </div>
            <div
              className={styles.viewToggle}
              role="group"
              aria-label="Display house plans"
            >
              <button
                type="button"
                aria-label="Gallery view"
                aria-pressed={view === "gallery"}
                onClick={() => setView("gallery")}
              >
                <LayoutGrid size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className={styles.quickFilters}
            role="group"
            aria-label="Quick bedroom filters"
          >
            <span>
              <BedDouble size={16} aria-hidden="true" /> Room for your life
            </span>
            {["", "1", "2", "3", "4+"].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={(bedrooms || "") === value}
                onClick={() => updateFilters({ bedrooms: value || undefined })}
              >
                {value
                  ? `${value} bed${value === "1" ? "" : "s"}`
                  : "Any bedrooms"}
              </button>
            ))}
          </div>
          {chips.length > 0 && (
            <div className={styles.activeFilters} aria-label="Active filters">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => updateFilters(chip.updates)}
                  aria-label={`Remove ${chip.label} filter`}
                >
                  {chip.label}
                  <X size={12} aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
          <div className={isPending ? styles.pendingResults : undefined}>
            <PublicDesignsInfiniteGrid
              fallbackImage="/images/category-placeholder.webp"
              search={search}
              category={category}
              sort={sort}
              isFeatured={isFeatured}
              minPrice={minPrice}
              maxPrice={maxPrice}
              bedrooms={bedrooms}
              minSize={minSize}
              maxSize={maxSize}
              priceType={priceType}
              view={view}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
