import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";

interface AllDesignsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
    pageSize?: string;
    isFeatured?: string;
  };
}

function normalizeSearchParam(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 1) return [] as Array<number | string>;

  const delta = 2;
  const pages: Array<number | string> = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i += 1) pages.push(i);
  if (right < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

const AllDesignsPage = async ({ searchParams }: AllDesignsPageProps) => {
  const category = normalizeSearchParam(searchParams.category);
  const sort = normalizeSearchParam(searchParams.sort) || "name";
  const search = normalizeSearchParam(searchParams.search);
  const isFeatured = searchParams.isFeatured === "true";

  const currentPage = Number(searchParams.page) > 0 ? Number(searchParams.page) : 1;
  const pageSize = Number(searchParams.pageSize) > 0 ? Number(searchParams.pageSize) : 9;
  const skip = (currentPage - 1) * pageSize;

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

  const orderBy: Prisma.DesignOrderByWithRelationInput =
    sort === "price-asc"
      ? { basePrice: "asc" }
      : sort === "price-desc"
        ? { basePrice: "desc" }
        : { name: "asc" };

  const [categories, designs, totalDesigns, totalUsers, featuredDesign] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.design.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        images: true,
        category: true,
      },
    }),
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
  ]);

  const totalPages = Math.ceil(totalDesigns / pageSize);
  const allCategories = ["All", ...categories.map((item) => item.name)];
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const fallbackImage = "/images/banners/banner1.jpg";
  const serifSystem = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
  const monoSystem =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const minPrice = designs.length ? Math.min(...designs.map((item) => item.basePrice)) : 0;
  const maxPrice = designs.length ? Math.max(...designs.map((item) => item.basePrice)) : 0;
  const bedroomCounts = designs.reduce(
    (acc, design) => {
      const key = String(design.bedrooms ?? "Unknown");
      acc[key] = (acc[key] || 0) + 1;
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
            <span className="block italic text-gold not-italic">
              <em className="italic">Plans.</em>
            </span>
          </h1>

          <div className="flex flex-col gap-8 pb-8 md:flex-row md:items-end md:justify-between md:pb-12">
            <p
              className="max-w-[340px] text-[13px] font-light leading-[1.8] text-cream-dim"
              style={{ fontFamily: monoSystem }}
            >
              Curated architectural designs for every Kenyan homeowner. Filter by style, size,
              and budget to find your blueprint.
            </p>
            <div className="flex gap-6 sm:gap-12">
              <div>
                <p className="text-[42px] font-light leading-none text-cream">{totalDesigns}+</p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  House Plans
                </p>
              </div>
              <div>
                <p className="text-[42px] font-light leading-none text-cream">{categories.length}</p>
                <p
                  className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted"
                  style={{ fontFamily: monoSystem }}
                >
                  Categories
                </p>
              </div>
              <div>
                <p className="text-[42px] font-light leading-none text-cream">{totalUsers}+</p>
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
            <span key={`${item}-${idx}`} className="px-8 text-[14px] italic text-cream-dim">
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
                    active
                      ? "text-cream"
                      : "text-muted hover:text-cream"
                  }`}
                  style={{ fontFamily: monoSystem }}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          <Link
            href={queryWith({ isFeatured: isFeatured ? undefined : "true", page: "1" })}
            className={`ml-1 border px-3 py-2 text-[10px] uppercase tracking-[0.2em] ${
              isFeatured
                ? "border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] text-gold"
                : "border-[rgba(200,137,42,0.22)] bg-[rgba(200,137,42,0.08)] text-gold hover:bg-[rgba(200,137,42,0.15)]"
            }`}
            style={{ fontFamily: monoSystem }}
          >
            Featured Only
          </Link>

          <form action="/designs" method="get" className="ml-auto w-full sm:w-[220px] lg:w-[290px]">
            <input type="hidden" name="category" value={category || ""} />
            <input type="hidden" name="sort" value={sort || "name"} />
            <input type="hidden" name="isFeatured" value={isFeatured ? "true" : ""} />
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
                    <span>{bedroom === "Unknown" ? "Unknown" : `${bedroom} Bed${bedroom === "1" ? "" : "s"}`}</span>
                    <span className="text-[10px] tracking-[0.1em] text-muted">{count}</span>
                  </button>
                ))}
            </div>
          </div>

          <div className="mb-10">
            <p
              className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold after:h-px after:flex-1 after:bg-[rgba(200,137,42,0.22)] after:content-['']"
              style={{ fontFamily: monoSystem }}
            >
              Budget (KES)
            </p>
            <div className="relative my-4 h-[2px] bg-[rgba(240,232,216,0.08)]">
              <div className="absolute inset-y-0 left-[10%] right-[30%] bg-gold" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted" style={{ fontFamily: monoSystem }}>
              <span>{minPrice ? `KES ${Math.floor(minPrice / 1000)}K` : "KES 0"}</span>
              <span>{maxPrice ? `KES ${Math.ceil(maxPrice / 1000)}K` : "KES 0"}</span>
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
            <h2 className="text-[28px] font-light text-cream" style={{ fontFamily: serifSystem }}>
              All <em className="italic text-gold">Designs</em>
            </h2>
            <Link
              href={queryWith({ isFeatured: isFeatured ? undefined : "true", page: "1" })}
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
                <p className="mb-6 line-clamp-3 text-[13px] leading-[1.7] text-cream-dim" style={{ fontFamily: monoSystem }}>
                  {featuredDesign.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.12em] text-muted" style={{ fontFamily: monoSystem }}>
                  <span>{featuredDesign.bedrooms ?? "-"} Beds</span>
                  <span>{featuredDesign.bathrooms ?? "-"} Baths</span>
                  <span>{featuredDesign.area ?? "-"} m2</span>
                </div>
                <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-5">
                  <p className="text-2xl font-light text-cream">
                    <span className="mr-1 text-[10px] uppercase tracking-[0.15em] text-muted" style={{ fontFamily: monoSystem }}>
                      from
                    </span>
                    KES {featuredDesign.basePrice.toLocaleString()}
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

          {designs.length > 0 ? (
            <div className="grid grid-cols-1 gap-px bg-[rgba(240,232,216,0.08)] md:grid-cols-2 xl:grid-cols-3">
              {designs.map((design, index) => {
                const imageUrl = design.images?.[0]?.url || fallbackImage;

                return (
                  <article
                    key={design.id}
                    className="group bg-ink transition-colors duration-300 hover:bg-card"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={design.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95"
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
                      <span className="absolute bottom-4 right-4 text-[10px] tracking-[0.12em] text-[rgba(240,232,216,0.45)]" style={{ fontFamily: monoSystem }}>
                        {String(skip + index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gold" style={{ fontFamily: monoSystem }}>
                          {design.category?.name || "Uncategorized"}
                        </p>
                        <p className="text-[10px] tracking-[0.1em] text-muted" style={{ fontFamily: monoSystem }}>
                          {(design.views || 0).toLocaleString()} views
                        </p>
                      </div>

                      <h3
                        className="mb-3 line-clamp-1 text-3xl font-light text-cream transition-colors group-hover:text-gold-light"
                        style={{ fontFamily: serifSystem }}
                      >
                        {design.name}
                      </h3>

                      <div className="mb-5 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.12em] text-muted" style={{ fontFamily: monoSystem }}>
                        <span>{design.bedrooms ?? "-"} Beds</span>
                        <span>{design.bathrooms ?? "-"} Baths</span>
                        <span>{design.area ?? "-"} m2</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-4">
                        <p className="text-2xl font-light text-cream">
                          <span className="mr-1 text-[10px] uppercase tracking-[0.15em] text-muted" style={{ fontFamily: monoSystem }}>
                            from
                          </span>
                          KES {design.basePrice.toLocaleString()}
                        </p>
                        <Link
                          href={`/designs/${design.id}`}
                          className="text-[10px] uppercase tracking-[0.16em] text-cream-dim transition-colors group-hover:text-gold"
                          style={{ fontFamily: monoSystem }}
                        >
                          View Plan
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="border border-[rgba(240,232,216,0.08)] bg-card/40 p-16 text-center">
              <h3 className="mb-2 text-4xl font-light text-cream" style={{ fontFamily: serifSystem }}>
                No designs found
              </h3>
              <p className="text-[12px] tracking-[0.08em] text-muted" style={{ fontFamily: monoSystem }}>
                Adjust the category, featured toggle, or search phrase.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-2 flex flex-col items-center justify-between gap-5 border-t border-[rgba(240,232,216,0.08)] pt-8 sm:flex-row">
              <p className="text-[11px] tracking-[0.08em] text-muted" style={{ fontFamily: monoSystem }}>
                Showing {Math.min(skip + 1, totalDesigns)} - {Math.min(skip + pageSize, totalDesigns)} of {totalDesigns}
              </p>

              <div className="flex items-center gap-1">
                <Link
                  href={queryWith({ page: String(Math.max(currentPage - 1, 1)) })}
                  className={`px-3 py-2 text-[11px] uppercase tracking-[0.14em] ${
                    currentPage === 1
                      ? "pointer-events-none border border-[rgba(240,232,216,0.08)] text-[rgba(240,232,216,0.3)]"
                      : "border border-[rgba(240,232,216,0.12)] text-cream-dim hover:text-cream"
                  }`}
                  style={{ fontFamily: monoSystem }}
                >
                  Prev
                </Link>

                {pageNumbers.map((item, idx) =>
                  typeof item === "number" ? (
                    <Link
                      key={`${item}-${idx}`}
                      href={queryWith({ page: String(item) })}
                      className={`h-9 min-w-9 px-2 text-center text-[11px] leading-9 tracking-[0.08em] ${
                        item === currentPage
                          ? "border border-[rgba(200,137,42,0.34)] bg-[rgba(200,137,42,0.1)] text-gold"
                          : "border border-[rgba(240,232,216,0.1)] text-cream-dim hover:text-cream"
                      }`}
                      style={{ fontFamily: monoSystem }}
                    >
                      {item}
                    </Link>
                  ) : (
                    <span key={`${item}-${idx}`} className="px-2 text-[11px] text-muted" style={{ fontFamily: monoSystem }}>
                      ...
                    </span>
                  ),
                )}

                <Link
                  href={queryWith({ page: String(Math.min(currentPage + 1, totalPages)) })}
                  className={`px-3 py-2 text-[11px] uppercase tracking-[0.14em] ${
                    currentPage === totalPages
                      ? "pointer-events-none border border-[rgba(240,232,216,0.08)] text-[rgba(240,232,216,0.3)]"
                      : "border border-[rgba(240,232,216,0.12)] text-cream-dim hover:text-cream"
                  }`}
                  style={{ fontFamily: monoSystem }}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllDesignsPage;
