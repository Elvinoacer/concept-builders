"use client";

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
import Image from "next/image";
import Link from "next/link";
import { FiAlertTriangle, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

interface Design {
  id: string;
  name: string;
  description: string;
  images: { url: string; type: string; name?: string }[];
  isFeatured: boolean;
  basePrice: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  views?: number;
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

export default function CategoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const safeSearchParams = searchParams ?? new URLSearchParams();
  const categoryId = params?.id;

  const serifSystem =
    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
  const monoSystem =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    safeSearchParams.get("search") || "",
  );

  const page = safeSearchParams.get("page")
    ? parseInt(safeSearchParams.get("page") || "1", 10)
    : 1;
  const search = safeSearchParams.get("search") || "";

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    const getCategory = async () => {
      if (!categoryId) {
        setError("Invalid category URL. Please reopen this category.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/categories/${categoryId}?page=${page}&search=${encodeURIComponent(search)}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch category");
        }
        const data = await res.json();
        setCategory(data);
      } catch {
        setError("Failed to load category. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [categoryId, page, search]);

  const totalPages = category ? Math.ceil(category._count.designs / 10) : 0;
  const totalDesigns = category?._count.designs || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toCategoryLink = (nextPage: number, nextSearch?: string) => {
    const paramsObj = new URLSearchParams();
    paramsObj.set("page", String(Math.max(1, nextPage)));
    const query = typeof nextSearch === "string" ? nextSearch : search;
    if (query) paramsObj.set("search", query);

    if (!categoryId) return "/categories";
    return `${pathname}?${paramsObj.toString()}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(toCategoryLink(1, searchQuery));
  };

  const getDesignImage = (design: Design) => {
    return design.images?.[0]?.url || "/images/banners/banner1.jpg";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-ink text-cream">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-dashed border-gold" />
        <p className="text-cream-dim" style={{ fontFamily: monoSystem }}>
          Loading category...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-ink px-4 text-center">
        <div className="w-full max-w-md border border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.08)] p-8">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center border border-[rgba(220,38,38,0.4)] text-red-300">
            <FiAlertTriangle size={24} />
          </div>
          <h1
            className="text-4xl font-light text-cream"
            style={{ fontFamily: serifSystem }}
          >
            Something Went Wrong
          </h1>
          <p className="mt-3 text-cream-dim" style={{ fontFamily: monoSystem }}>
            {error || "Unable to load category details."}
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex w-full items-center justify-center border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-5 py-3 text-xs uppercase tracking-[0.18em] text-gold"
            style={{ fontFamily: monoSystem }}
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-ink px-4 text-center">
        <div className="w-full max-w-md border border-[rgba(240,232,216,0.08)] bg-card p-8">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center border border-[rgba(240,232,216,0.1)] text-muted">
            <FiAlertTriangle size={24} />
          </div>
          <h1
            className="text-4xl font-light text-cream"
            style={{ fontFamily: serifSystem }}
          >
            Category Not Found
          </h1>
          <p className="mt-3 text-cream-dim" style={{ fontFamily: monoSystem }}>
            The category may have been moved or removed.
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex w-full items-center justify-center border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-5 py-3 text-xs uppercase tracking-[0.18em] text-gold"
            style={{ fontFamily: monoSystem }}
          >
            Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <section className="relative overflow-hidden border-b border-[rgba(240,232,216,0.08)] px-6 pb-12 pt-28 sm:px-10 lg:px-[60px] lg:pt-40">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_46%_at_78%_34%,rgba(200,137,42,0.08),transparent_64%),radial-gradient(ellipse_42%_42%_at_22%_82%,rgba(200,137,42,0.04),transparent_64%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:88px_88px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.5)_26%,rgba(0,0,0,0.5)_74%,transparent)]" />
        </div>
        <Image
          src={category.image || "/images/banners/banner2.jpg"}
          alt={category.name}
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/65 to-ink/45" />

        <div className="relative mx-auto w-full max-w-screen-2xl">
          <p
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.24em] text-gold"
            style={{ fontFamily: monoSystem }}
          >
            <span className="h-px w-8 bg-gold" />
            Category Spotlight
          </p>

          <h1
            className="text-[clamp(48px,8vw,120px)] font-light leading-[0.9] tracking-[-0.03em]"
            style={{ fontFamily: serifSystem }}
          >
            {category.name}
            <span className="block text-gold italic">Plans.</span>
          </h1>

          {category.description && (
            <p
              className="mt-7 max-w-[620px] text-[13px] leading-[1.85] text-cream-dim"
              style={{ fontFamily: monoSystem }}
            >
              {category.description}
            </p>
          )}

          <div className="mt-10 grid grid-cols-2 gap-px border border-[rgba(240,232,216,0.08)] bg-[rgba(240,232,216,0.08)] md:grid-cols-4">
            {[
              { label: "Plans", value: String(totalDesigns) },
              { label: "Page", value: String(page) },
              { label: "Search", value: search ? "Filtered" : "All" },
              { label: "Featured", value: category.image ? "Yes" : "No" },
            ].map((item) => (
              <div key={item.label} className="bg-ink/80 px-5 py-4">
                <p
                  className="text-[10px] uppercase tracking-[0.18em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  {item.label}
                </p>
                <p
                  className="mt-2 text-2xl font-light text-cream"
                  style={{ fontFamily: serifSystem }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-[73px] z-20 border-b border-[rgba(240,232,216,0.08)] bg-[rgba(10,9,7,0.95)] px-6 backdrop-blur-xl sm:px-10 lg:px-[60px]">
        <div className="mx-auto flex min-h-16 w-full max-w-screen-2xl flex-wrap items-center gap-3 py-3 lg:flex-nowrap lg:gap-0">
          <Link
            href="/categories"
            className="pr-6 text-[11px] uppercase tracking-[0.14em] text-cream-dim transition-colors hover:text-gold lg:border-r lg:border-[rgba(240,232,216,0.08)]"
            style={{ fontFamily: monoSystem }}
          >
            ← All Categories
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 items-center gap-3 lg:pl-6"
          >
            <div className="group relative w-full max-w-xl">
              <FiSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-gold"
                size={16}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="h-10 w-full border border-[rgba(240,232,216,0.18)] bg-[rgba(22,20,18,0.72)] py-2 pl-9 pr-3 text-[12px] tracking-[0.08em] text-cream outline-none placeholder:text-[rgba(168,152,128,0.9)] transition-all focus:border-[rgba(200,137,42,0.45)]"
                placeholder={`Search ${category.name} plans...`}
                style={{ fontFamily: monoSystem }}
              />
            </div>
            <button
              type="submit"
              className="border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-[rgba(200,137,42,0.16)]"
              style={{ fontFamily: monoSystem }}
            >
              Search
            </button>
          </form>

          <p
            className="ml-auto text-[11px] uppercase tracking-[0.14em] text-muted"
            style={{ fontFamily: monoSystem }}
          >
            <span className="text-gold">{totalDesigns}</span> plans
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-screen-2xl px-6 pb-20 pt-8 sm:px-10 lg:px-[60px]">
        {category.designs.length === 0 ? (
          <div className="border border-[rgba(240,232,216,0.08)] bg-card/40 p-16 text-center">
            <h3
              className="text-4xl font-light text-cream"
              style={{ fontFamily: serifSystem }}
            >
              No plans found
            </h3>
            <p
              className="mt-3 text-[12px] tracking-[0.08em] text-muted"
              style={{ fontFamily: monoSystem }}
            >
              {search
                ? `No results for "${search}" in this category.`
                : `No plans are available in ${category.name} yet.`}
            </p>
            {search && (
              <Link
                href={toCategoryLink(1, "")}
                className="mt-6 inline-flex border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] px-5 py-3 text-xs uppercase tracking-[0.16em] text-gold"
                style={{ fontFamily: monoSystem }}
              >
                Clear Search
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-[rgba(240,232,216,0.08)] md:grid-cols-2 xl:grid-cols-3">
            {category.designs.map((design, index) => (
              <Link
                key={design.id}
                href={`/designs/${design.id}`}
                className="group bg-ink transition-colors duration-300 hover:bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={getDesignImage(design)}
                    alt={design.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  {design.isFeatured && (
                    <span
                      className="absolute left-4 top-4 bg-gold px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-ink"
                      style={{ fontFamily: monoSystem }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.2em] text-gold"
                    style={{ fontFamily: monoSystem }}
                  >
                    {category.name}
                  </p>
                  <h3
                    className="mb-3 line-clamp-1 text-3xl font-light text-cream transition-colors group-hover:text-gold-light"
                    style={{ fontFamily: serifSystem }}
                  >
                    {design.name}
                  </h3>
                  <p
                    className="line-clamp-2 text-[12px] leading-[1.8] text-cream-dim"
                    style={{ fontFamily: monoSystem }}
                  >
                    {design.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-4">
                    <p
                      className="text-2xl font-light text-cream"
                      style={{ fontFamily: serifSystem }}
                    >
                      ${design.basePrice.toLocaleString()}
                    </p>
                    <span
                      className="text-[10px] uppercase tracking-[0.16em] text-cream-dim transition-colors group-hover:text-gold"
                      style={{ fontFamily: monoSystem }}
                    >
                      View Plan
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && category && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination>
              <PaginationContent className="flex-wrap gap-2 justify-center">
                <PaginationItem>
                  <Link href={toCategoryLink(1)}>
                    <PaginationFirst
                      aria-disabled={page === 1}
                      className={`p-3 ${
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface"
                      }`}
                    />
                  </Link>
                </PaginationItem>
                <PaginationItem>
                  <Link href={toCategoryLink(page - 1)}>
                    <PaginationPrevious
                      aria-disabled={page === 1}
                      className={`p-3 ${
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface"
                      }`}
                    />
                  </Link>
                </PaginationItem>

                {getPaginationRange(page, totalPages).map((p, index) => {
                  if (p === "...") {
                    return (
                      <PaginationItem key={index}>
                        <PaginationEllipsis className="p-3" />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={p}>
                      <Link href={toCategoryLink(p as number)}>
                        <PaginationLink
                          isActive={page === p}
                          className={`min-w-[2.5rem] ${
                            page === p
                              ? "bg-gold text-ink"
                              : "text-cream-dim hover:bg-surface hover:text-cream"
                          }`}
                        >
                          {p}
                        </PaginationLink>
                      </Link>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <Link href={toCategoryLink(page + 1)}>
                    <PaginationNext
                      aria-disabled={page === totalPages}
                      className={`p-3 ${
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface"
                      }`}
                    />
                  </Link>
                </PaginationItem>
                <PaginationItem>
                  <Link href={toCategoryLink(totalPages)}>
                    <PaginationLast
                      aria-disabled={page === totalPages}
                      className={`p-3 ${
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-surface"
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
  const maxVisiblePages =
    typeof window !== "undefined"
      ? window.innerWidth < 640
        ? 3
        : window.innerWidth < 1024
          ? 5
          : 7
      : 5;

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
  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}
