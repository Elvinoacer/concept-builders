import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";
import PublicDesignsInfiniteGrid from "@/components/design-showcase/PublicDesignsInfiniteGrid";

interface AllDesignsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
    pageSize?: string;
    isFeatured?: string;
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

  const allCategories = ["All", ...categories.map((item) => item.name)];
  const fallbackImage = "/images/banners/banner1.webp";
  const serifSystem =
    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
  const monoSystem =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const minPrice = priceRange._min.basePrice ?? 0;
  const maxPrice = priceRange._max.basePrice ?? 0;
  const bedroomCounts: Record<string, number> = bedroomSummary.reduce(
    (acc, item) => {
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
      <section className="relative overflow-hidden border-b border-[rgba(240,232,216,0.08)] px-6 pb-10 pt-28 sm:px-10 lg:px-[60px] lg:pt-40">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(200,137,42,0.07),transparent_65%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(200,137,42,0.04),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.035)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_30%,rgba(0,0,0,0.45)_70%,transparent)]" />
        </div>
        <p
          className="pointer-events-none absolute bottom-[-40px] right-[-20px] select-none whitespace-nowrap text-[clamp(120px,18vw,240px)] font-light leading-none text-[rgba(200,137,42,0.04)]"
          style={{ fontFamily: serifSystem }}
        >
          Plans
        </p>

        <div className="relative mx-auto flex w-full max-w-screen-2xl flex-col">
          <p
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-gold"
            style={{ fontFamily: monoSystem }}
          >
            <span className="h-px w-8 bg-gold" />
            Concept Builders · Kenya · {totalDesigns}+ Designs
          </p>

          <h1
            className="mb-10 text-[clamp(64px,10vw,148px)] font-light leading-[0.9] tracking-[-0.03em]"
            style={{ fontFamily: serifSystem }}
          >
            <span className="block">House</span>
            <span className="block text-gold not-italic">
              <em className="italic">Plans.</em>
            </span>
          </h1>

          <div className="flex flex-col gap-8 pb-8 md:flex-row md:items-end md:justify-between md:pb-12">
            <p
              className="max-w-[340px] text-[13px] font-light leading-[1.8] text-cream-dim"
              style={{ fontFamily: monoSystem }}
            >
              Curated architectural designs for every Kenyan homeowner. Filter
              by style, size, and budget to find your blueprint.
            </p>
            <div className="flex gap-6 sm:gap-12">
              <div>
                <p className="text-[42px] font-light leading-none text-cream">
                  {totalDesigns}+
                </p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  House Plans
                </p>
              </div>
              <div>
                <p className="text-[42px] font-light leading-none text-cream">
                  {categories.length}
                </p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  Categories
                </p>
              </div>
              <div>
                <p className="text-[42px] font-light leading-none text-cream">
                  {totalUsers}+
                </p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  Happy Clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[137px] z-[19] hidden overflow-hidden border-b border-[rgba(240,232,216,0.08)] bg-card py-4 md:block">
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
        <div className="mx-auto flex h-16 w-full max-w-screen-2xl flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-0">
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

          <div className="flex items-center gap-2 border-l border-[rgba(240,232,216,0.08)] pl-4">
            <span
              className="hidden text-[10px] uppercase tracking-[0.15em] text-muted xl:inline"
              style={{ fontFamily: monoSystem }}
            >
              Sort
            </span>
            {sortOptions.map((option) => {
              const active = sort === option.value;
              return (
                <Link
                  key={option.value}
                  href={queryWith({ sort: option.value, page: "1" })}
                  className={`px-2 py-1 text-[11px] uppercase tracking-[0.12em] ${
                    active ? "text-cream" : "text-muted hover:text-cream"
                  }`}
                  style={{ fontFamily: monoSystem }}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          <Link
            href={queryWith({
              isFeatured: isFeatured ? undefined : "true",
              page: "1",
            })}
            className={`ml-1 border px-3 py-2 text-[10px] uppercase tracking-[0.2em] ${
              isFeatured
                ? "border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] text-gold"
                : "border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] text-gold hover:bg-[rgba(200,137,42,0.15)]"
            }`}
            style={{ fontFamily: monoSystem }}
          >
            Featured Only
          </Link>

          <form
            action="/designs"
            method="get"
            className="ml-auto w-full sm:w-[220px] lg:w-[290px]"
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
              <button
                className="flex w-full items-center justify-between border border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] px-3 py-2 text-left text-[12px] tracking-[0.06em] text-gold"
                style={{ fontFamily: monoSystem }}
              >
                Any
              </button>
              {Object.entries(bedroomCounts)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([bedroom, count]) => (
                  <button
                    key={bedroom}
                    className="flex w-full items-center justify-between border border-transparent px-3 py-2 text-left text-[12px] tracking-[0.06em] text-cream-dim transition-colors hover:border-[rgba(240,232,216,0.08)] hover:bg-card hover:text-cream"
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
                  </button>
                ))}
            </div>
          </div>

          <div className="mb-10">
            <p
              className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold after:h-px after:flex-1 after:bg-[rgba(200,137,42,0.22)] after:content-['']"
              style={{ fontFamily: monoSystem }}
            >
              Budget (USD)
            </p>
            <div className="relative my-4 h-[2px] bg-[rgba(240,232,216,0.08)]">
              <div className="absolute inset-y-0 left-[10%] right-[30%] bg-gold" />
            </div>
            <div
              className="flex items-center justify-between text-[11px] text-muted"
              style={{ fontFamily: monoSystem }}
            >
              <span>
                {minPrice ? `$${Math.floor(minPrice / 1000)}K` : "$0"}
              </span>
              <span>{maxPrice ? `$${Math.ceil(maxPrice / 1000)}K` : "$0"}</span>
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
            <Link
              href={queryWith({
                isFeatured: isFeatured ? undefined : "true",
                page: "1",
              })}
              className="inline-flex items-center gap-2 border border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-[rgba(200,137,42,0.15)]"
              style={{ fontFamily: monoSystem }}
            >
              <span className="text-xs">★</span> Featured Only
            </Link>
          </div>

          <div className="flex flex-col gap-10">
            {featuredDesign && (
              <article className="grid overflow-hidden border border-[rgba(240,232,216,0.08)] bg-card lg:grid-cols-[1.4fr_1fr]">
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
                      <span
                        className="mr-1 text-[10px] uppercase tracking-[0.15em] text-muted"
                        style={{ fontFamily: monoSystem }}
                      >
                        from
                      </span>
                      ${featuredDesign.basePrice.toLocaleString()}
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

            <PublicDesignsInfiniteGrid
              fallbackImage={fallbackImage}
              search={search}
              category={category}
              sort={sort}
              isFeatured={isFeatured}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllDesignsPage;
