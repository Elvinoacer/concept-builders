import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";
import PublicDesignsInfiniteGrid from "@/components/design-showcase/PublicDesignsInfiniteGrid";

type CategoryName = { name: string };
type BedroomGroup = { bedrooms: number | null; _count: { _all: number } };

interface AllDesignsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
    pageSize?: string;
    isFeatured?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    minSize?: string;
    maxSize?: string;
    priceType?: string;
  }>;
}

function normalizeSearchParam(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const AllDesignsPage = async ({ searchParams }: AllDesignsPageProps) => {
  const resolvedSearchParams = await searchParams;

  const category = normalizeSearchParam(resolvedSearchParams.category);
  const sort = normalizeSearchParam(resolvedSearchParams.sort) || "name";
  const search = normalizeSearchParam(resolvedSearchParams.search);
  const isFeatured = resolvedSearchParams.isFeatured === "true";
  const minPrice = normalizeSearchParam(resolvedSearchParams.minPrice);
  const maxPrice = normalizeSearchParam(resolvedSearchParams.maxPrice);
  const bedrooms = normalizeSearchParam(resolvedSearchParams.bedrooms);
  const minSize = normalizeSearchParam(resolvedSearchParams.minSize);
  const maxSize = normalizeSearchParam(resolvedSearchParams.maxSize);
  const priceType = normalizeSearchParam(resolvedSearchParams.priceType) || "design";

  const pageSize =
    Number(resolvedSearchParams.pageSize) > 0
      ? Number(resolvedSearchParams.pageSize)
      : 9;

  const where: Prisma.DesignWhereInput = {};

  if (category && category !== "All") {
    where.category = { name: category };
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (isFeatured) {
    where.isFeatured = true;
  }

  if (bedrooms) {
    where.bedrooms = bedrooms === "4+" ? { gte: 4 } : Number(bedrooms);
  }

  if (minSize || maxSize) {
    where.area = {
      ...(minSize ? { gte: Number(minSize) } : {}),
      ...(maxSize ? { lte: Number(maxSize) } : {}),
    };
  }

  if (minPrice || maxPrice) {
    if (priceType === "building") {
      if (minPrice) where.minBuildingCost = { gte: Number(minPrice) };
      if (maxPrice) where.maxBuildingCost = { lte: Number(maxPrice) };
    } else {
      where.basePrice = {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      };
    }
  }

  const [
    categories,
    totalDesigns,
    totalUsers,
    featuredDesign,
    priceRange,
    bedroomSummary,
  ] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.design.count({ where }),
    prisma.user.count(),
    prisma.design.findFirst({
      where: { isFeatured: true },
      include: {
        images: true,
        category: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.design.aggregate({
      where,
      _min: { basePrice: true },
      _max: { basePrice: true },
    }),
    prisma.design.groupBy({
      by: ["bedrooms"],
      where,
      _count: { _all: true },
    }),
  ]);

  const allCategories = ["All", ...categories.map((item: CategoryName) => item.name)];
  const fallbackImage = "/images/banners/banner1.webp";
  const serifSystem =
    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
  const monoSystem =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const displayMinPrice = priceRange._min.basePrice ?? 0;
  const displayMaxPrice = priceRange._max.basePrice ?? 0;
  const bedroomCounts: Record<string, number> = bedroomSummary.reduce(
    (acc: Record<string, number>, item: BedroomGroup) => {
      const key = item.bedrooms === null ? "Unknown" : String(item.bedrooms);
      acc[key] = item._count._all;
      return acc;
    },
    {} as Record<string, number>,
  );

  const queryWith = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    const setIf = (key: string, value?: string) => {
      if (value && value.trim() !== "") {
        params.set(key, value);
      }
    };

    setIf("category", category);
    setIf("sort", sort);
    setIf("search", search);
    setIf("isFeatured", isFeatured ? "true" : undefined);
    setIf("pageSize", String(pageSize));
    setIf("minPrice", minPrice);
    setIf("maxPrice", maxPrice);
    setIf("bedrooms", bedrooms);
    setIf("minSize", minSize);
    setIf("maxSize", maxSize);
    setIf("priceType", priceType);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value.trim() === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    return `/designs${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-asc", label: "Price Up" },
    { value: "price-desc", label: "Price Down" },
  ];

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* UX FIX: Drastically optimized padding from pt-28/pt-40 down to compact alternative */}
      <section className="relative overflow-hidden border-b border-[rgba(240,232,216,0.08)] px-6 pb-8 pt-24 sm:px-10 lg:px-[60px] lg:pt-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: `url('${fallbackImage}')`, backgroundSize: "cover", backgroundPosition: "center top", opacity: 0.08 }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(200,137,42,0.07),transparent_65%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(200,137,42,0.04),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.035)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_30%,rgba(0,0,0,0.45)_70%,transparent)]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-screen-2xl flex-col">
          <p
            className="mb-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-gold"
            style={{ fontFamily: monoSystem }}
          >
            <span className="h-px w-6 bg-gold" />
            Concept Builders · Kenya · {totalDesigns}+ Designs
          </p>

          {/* UX FIX: Re-structured to two clean columns to bring the view up into the first fold */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <h1
                className="mb-3 text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl"
                style={{ fontFamily: serifSystem }}
              >
                House <em className="italic text-gold">Plans.</em>
              </h1>

              <p
                className="max-w-[480px] text-[13px] font-light leading-[1.7] text-cream-dim mb-5"
                style={{ fontFamily: monoSystem }}
              >
                Curated architectural designs for every Kenyan homeowner. Filter
                by style, size, and budget to find your blueprint.
              </p>

              {/* UX FIX: Moved here, highly prominent CTA with a bouncing down arrow */}
              <a
                href="#plans-grid"
                className="inline-flex items-center gap-3 border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.06)] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold hover:bg-[rgba(200,137,42,0.15)] hover:text-cream transition-all duration-300"
                style={{ fontFamily: monoSystem }}
              >
                <span>View Blueprints</span>
                <svg
                  className="w-3 h-3 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </a>
            </div>

            {/* UX FIX: Clean inline condensed stats */}
            <div className="flex flex-wrap gap-6 sm:gap-10 lg:justify-end lg:pb-2">
              <div>
                <p className="text-3xl font-light leading-none text-cream">
                  {totalDesigns}+
                </p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  House Plans
                </p>
              </div>
              <div>
                <p className="text-3xl font-light leading-none text-cream">
                  {categories.length}
                </p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  Categories
                </p>
              </div>
              <div>
                <p className="text-3xl font-light leading-none text-cream">
                  {totalUsers}+
                </p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  Happy Clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hidden overflow-hidden border-b border-[rgba(240,232,216,0.08)] bg-card py-4 md:block">
        <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap">
          {[
            "Architectural Excellence",
            "500+ House Plans",
            "Kenyan Dream Homes",
            "Bespoke Blueprints",
            "Structural Drawings",
            "CAD Files Included",
            "47 Counties Served",
            "Custom Designs Welcome",
            "Architectural Excellence",
            "500+ House Plans",
            "Kenyan Dream Homes",
            "Bespoke Blueprints",
          ].map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="px-8 text-[14px] italic text-cream-dim"
            >
              <span className="mr-7 inline-block h-[5px] w-[5px] rounded-full bg-gold align-middle" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="sticky top-[73px] z-20 border-b border-[rgba(240,232,216,0.08)] bg-[rgba(10,9,7,0.95)] px-6 backdrop-blur-xl sm:px-10 lg:px-[60px]">
        <div className="mx-auto flex min-h-16 w-full max-w-screen-2xl flex-wrap items-center gap-3 py-3 lg:flex-nowrap lg:gap-0">
          <div className="pr-6 text-[11px] uppercase tracking-[0.15em] text-muted lg:border-r lg:border-[rgba(240,232,216,0.08)] lg:pr-8">
            <span className="text-gold">{totalDesigns}</span> results
          </div>

          <div className="flex max-w-full flex-1 items-center gap-0 overflow-x-auto px-0 scrollbar-hide lg:px-6">
            {allCategories.map((item) => {
              const active = (category || "All") === item;
              return (
                <Link
                  key={item}
                  href={queryWith({
                    category: item === "All" ? undefined : item,
                    page: "1",
                  })}
                  className={`relative whitespace-nowrap px-5 py-2 text-[11px] uppercase tracking-[0.14em] transition-all ${
                    active
                      ? "text-gold after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-gold"
                      : "text-muted hover:text-cream"
                  }`}
                  style={{ fontFamily: monoSystem }}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <form
            action="/designs"
            method="get"
            className="ml-auto w-full sm:w-[220px] lg:w-[290px] mt-2 lg:mt-0"
          >
            <input type="hidden" name="category" value={category || ""} />
            <input type="hidden" name="sort" value={sort || "name"} />
            <input
              type="hidden"
              name="isFeatured"
              value={isFeatured ? "true" : ""}
            />
            <input type="hidden" name="pageSize" value={String(pageSize)} />
            <input type="hidden" name="page" value="1" />
            <div className="group relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-gold">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                name="search"
                defaultValue={search || ""}
                placeholder="Search plans..."
                className="h-10 w-full border border-[rgba(240,232,216,0.2)] bg-[rgba(20,18,16,0.7)] py-2 pl-9 pr-3 text-[12px] tracking-[0.07em] text-cream outline-none placeholder:text-[rgba(168,152,128,0.9)] transition-all focus:border-[rgba(200,137,42,0.45)] focus:bg-[rgba(20,18,16,0.92)]"
                style={{ fontFamily: monoSystem }}
              />
            </div>
          </form>
        </div>
      </section>

      {/* Secondary Controls Bar (Not sticky) */}
      <section className="border-b border-[rgba(240,232,216,0.08)] bg-ink px-6 sm:px-10 lg:px-[60px] py-4">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="text-[10px] uppercase tracking-[0.15em] text-muted"
              style={{ fontFamily: monoSystem }}
            >
              Sort By
            </span>
            <div className="flex gap-2">
              {sortOptions.map((option) => {
                const active = sort === option.value;
                return (
                  <Link
                    key={option.value}
                    href={queryWith({ sort: option.value, page: "1" })}
                    className={`px-3 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors border-b-2 ${
                      active ? "text-cream border-gold font-medium" : "text-muted border-transparent hover:text-cream hover:border-gold/30"
                    }`}
                    style={{ fontFamily: monoSystem }}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <Link
            href={queryWith({
              isFeatured: isFeatured ? undefined : "true",
              page: "1",
            })}
            className={`border px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors ${
              isFeatured
                ? "border-[rgba(200,137,42,0.34)] bg-gold text-ink"
                : "border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] text-gold hover:bg-[rgba(200,137,42,0.15)]"
            }`}
            style={{ fontFamily: monoSystem }}
          >
            ★ Featured Only
          </Link>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-screen-2xl">
        <aside className="sticky top-[137px] hidden h-[calc(100vh-137px)] w-[260px] shrink-0 overflow-y-auto border-r border-[rgba(240,232,216,0.08)] px-8 py-10 lg:block">
          <div className="mb-10">
            <p
              className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold after:h-px after:flex-1 after:bg-[rgba(200,137,42,0.22)] after:content-['']"
              style={{ fontFamily: monoSystem }}
            >
              Bedrooms
            </p>
            <div className="space-y-1">
              <Link
                href={queryWith({ bedrooms: undefined, page: "1" })}
                className={`flex w-full items-center justify-between border px-3 py-2 text-left text-[12px] tracking-[0.06em] ${!bedrooms ? "border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] text-gold" : "border-transparent text-cream-dim hover:border-[rgba(240,232,216,0.08)] hover:bg-card hover:text-cream"}`}
                style={{ fontFamily: monoSystem }}
              >
                Any
              </Link>
              {Object.entries(bedroomCounts)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([bedroom, count]) => (
                  <Link
                    key={bedroom}
                    href={queryWith({ bedrooms: bedroom === "Unknown" ? undefined : bedroom, page: "1" })}
                    className={`flex w-full items-center justify-between border px-3 py-2 text-left text-[12px] tracking-[0.06em] transition-colors ${bedrooms === bedroom ? "border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] text-gold" : "border-transparent text-cream-dim hover:border-[rgba(240,232,216,0.08)] hover:bg-card hover:text-cream"}`}
                    style={{ fontFamily: monoSystem }}
                  >
                    <span>
                      {bedroom === "Unknown"
                        ? "Unknown"
                        : `${bedroom} Bed${bedroom === "1" ? "" : "s"}`}
                    </span>
                    <span className="text-[10px] tracking-[0.1em] text-muted">
                      {count}
                    </span>
                  </Link>
                ))}
            </div>
          </div>



          <div className="mb-10">
            <p
              className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold after:h-px after:flex-1 after:bg-[rgba(200,137,42,0.22)] after:content-['']"
              style={{ fontFamily: monoSystem }}
            >
              Categories
            </p>
            <div className="space-y-1">
              {allCategories.map((item) => {
                const active = (category || "All") === item;
                return (
                  <Link
                    key={item}
                    href={queryWith({
                      category: item === "All" ? undefined : item,
                      page: "1",
                    })}
                    className={`block border px-3 py-2 text-[12px] tracking-[0.06em] transition-colors ${
                      active
                        ? "border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] text-gold"
                        : "border-transparent text-cream-dim hover:border-[rgba(240,232,216,0.08)] hover:bg-card hover:text-cream"
                    }`}
                    style={{ fontFamily: monoSystem }}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="flex-1 px-6 pb-20 pt-10 sm:px-10 lg:px-12">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-[rgba(240,232,216,0.08)] pb-6 sm:flex-row sm:items-center">
            <h2
              className="text-[28px] font-light text-cream"
              style={{ fontFamily: serifSystem }}
            >
              All <em className="italic text-gold">Designs</em>
            </h2>

          </div>

          <div className="flex flex-col gap-10">
            {featuredDesign && (
              <article className="grid overflow-hidden border border-[rgba(240,232,216,0.08)] bg-card lg:grid-cols-[1.3fr_1fr]">
                <div className="relative min-h-[280px] overflow-hidden sm:min-h-[380px]">
                  <Image
                    src={featuredDesign.images?.[0]?.url || fallbackImage}
                    alt={featuredDesign.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <p
                    className="absolute left-4 top-4 border border-[rgba(200,137,42,0.34)] bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink"
                    style={{ fontFamily: monoSystem }}
                  >
                    Editor&apos;s Pick
                  </p>
                </div>

                <div className="flex flex-col justify-end p-6 sm:p-8">
                  <p
                    className="mb-4 text-[10px] uppercase tracking-[0.25em] text-gold"
                    style={{ fontFamily: monoSystem }}
                  >
                    - Featured Design
                  </p>
                  <h2
                    className="mb-3 text-4xl font-light leading-[1.05] text-cream"
                    style={{ fontFamily: serifSystem }}
                  >
                    {featuredDesign.name}
                  </h2>
                  <p
                    className="mb-6 line-clamp-3 text-[13px] leading-[1.7] text-cream-dim"
                    style={{ fontFamily: monoSystem }}
                  >
                    {featuredDesign.description}
                  </p>
                  <div
                    className="mb-6 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.12em] text-muted"
                    style={{ fontFamily: monoSystem }}
                  >
                    <span>{featuredDesign.bedrooms ?? "-"} Beds</span>
                    <span>{featuredDesign.bathrooms ?? "-"} Baths</span>
                    <span>{featuredDesign.area ?? "-"} m2</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-5">
                    <p className="text-2xl font-light text-cream">
                      {featuredDesign.basePrice === 0 ? "Custom Quote" : (
                        <>
                          <span
                            className="mr-1 text-[10px] uppercase tracking-[0.15em] text-muted"
                            style={{ fontFamily: monoSystem }}
                          >
                            from
                          </span>
                          ${featuredDesign.basePrice.toLocaleString()}
                        </>
                      )}
                    </p>
                    <Link
                      href={`/designs/${featuredDesign.id}`}
                      className="border border-gold px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-ink"
                      style={{ fontFamily: monoSystem }}
                    >
                      View Plan
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* UX FIX: scroll-mt-56 precisely targets the landing start of the grid block without skipping components */}
            <div id="plans-grid" className="scroll-mt-32">
              <PublicDesignsInfiniteGrid
                fallbackImage={fallbackImage}
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
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllDesignsPage;
