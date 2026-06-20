"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Featured.css";
import DesignPreviewModal from "@/components/design-showcase/DesignPreviewModal";

type LandingDesign = {
  id?: string;
  name: string;
  category?: { name?: string | null } | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  basePrice?: number;
  images?: { url: string; type?: string | null }[];
  architecturalDesign?: { pdfFiles?: unknown[] } | null;
  structuralDesign?: { pdfFiles?: unknown[] } | null;
  isFeatured?: boolean;
};

type FeaturedPlan = {
  id: string;
  tag?: string | null;
  style: string;
  name: string;
  beds: number | string;
  baths: number | string;
  sqft: string;
  img: string;
  basePrice?: number;
  hasFiles?: boolean;
  badge?: string | null;
};

type FeaturedCategory = {
  id: string;
  label: string;
  dot: string;
  accent: string;
  count: number;
  plans: FeaturedPlan[];
};

const iconBed = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    width="12"
    height="12"
  >
    <rect x="1" y="5" width="14" height="9" rx="1.5" />
    <path d="M1 10h14M5 10V7h6v3" />
  </svg>
);
const iconSqft = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    width="12"
    height="12"
  >
    <rect x="2" y="2" width="12" height="12" rx="1" />
    <path d="M2 6h12M6 2v12" />
  </svg>
);
const iconArrow = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
const iconTag = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    width="11"
    height="11"
  >
    <path d="M9.5 2H3a1 1 0 00-1 1v6.5l6 6 6-6-4.5-7.5z" />
    <circle cx="5.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const categoryPalette = [
  "#5B9FD6",
  "#C49A3C",
  "#4EA870",
  "#A85CB0",
  "#E06A50",
  "#4FA3BF",
];

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const isDisplayImage = (image?: { url?: string; type?: string | null }) =>
  Boolean(image?.url) &&
  (image?.type === "IMAGE" ||
    /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i.test(image?.url ?? ""));

export default function Featured({
  allDesigns = [],
}: {
  allDesigns?: LandingDesign[];
}) {
  const categories = React.useMemo<FeaturedCategory[]>(() => {
    const grouped = new Map<string, FeaturedCategory>();

    const allFeaturedCategory: FeaturedCategory = {
      id: "all-featured",
      label: "All Featured",
      dot: "#FFF",
      accent: "#FFF",
      count: 0,
      plans: [],
    };

    allDesigns.forEach((design) => {
      const firstImage = design.images?.find(isDisplayImage);
      if (!design.id || !firstImage?.url) return;

      const planData: FeaturedPlan = {
        id: design.id,
        tag: design.category?.name?.trim() || "House Plans",
        style: design.category?.name?.trim() || "House Plans",
        name: design.name,
        beds: design.bedrooms ?? "—",
        baths: design.bathrooms ?? "—",
        sqft: design.area
          ? `${design.area.toLocaleString()} sqft`
          : "Area on request",
        img: firstImage.url,
        basePrice: design.basePrice,
        hasFiles: Boolean(
          design.architecturalDesign?.pdfFiles?.length ||
            design.structuralDesign?.pdfFiles?.length,
        ),
        badge: design.isFeatured ? "Featured" : null,
      };

      allFeaturedCategory.count += 1;
      allFeaturedCategory.plans.push(planData);

      const label = design.category?.name?.trim() || "House Plans";
      const id = toSlug(label);
      const existing = grouped.get(id);
      const paletteIndex = grouped.size % categoryPalette.length;
      const category = existing ?? {
        id,
        label,
        dot: categoryPalette[paletteIndex],
        accent: categoryPalette[paletteIndex],
        count: 0,
        plans: [],
      };

      category.count += 1;
      category.plans.push(planData);

      grouped.set(id, category);
    });

    const result = Array.from(grouped.values())
      .map((category) => ({ ...category, plans: category.plans.slice(0, 8) }))
      .filter((category) => category.plans.length > 0);

    if (allFeaturedCategory.plans.length > 0) {
      allFeaturedCategory.plans = allFeaturedCategory.plans.slice(0, 8);
      result.unshift(allFeaturedCategory);
    }

    return result;
  }, [allDesigns]);

  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const [shimmerKey, setShimmerKey] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!activeId && categories[0]) setActiveId(categories[0].id);
    if (activeId && !categories.some((category) => category.id === activeId)) {
      setActiveId(categories[0]?.id ?? "");
    }
  }, [activeId, categories]);

  const activeCol = categories.find((c) => c.id === activeId) ?? categories[0];
  const totalPlans = categories.reduce((s, c) => s + c.count, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.animationPlayState = "running";
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      const els = sectionRef.current.querySelectorAll(".animate-on-scroll");
      els.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setShimmerKey((prev) => prev + 1);
  }, [activeId]);

  if (!activeCol) return null;

  const mergedPlans = activeCol?.plans ?? [];

  const [hero, s1, s2, s3, s4] = mergedPlans;

  if (!activeCol || !hero) return null;

  return (
    <div className="fc-container">
      <section
        className="fc"
        id="featured"
        aria-label="Featured House Plan Collections"
        ref={sectionRef}
      >
        <div className="fc-inner">
          {/* HEADER */}
          <div className="fc-header animate-on-scroll">
            <div className="fc-header-left">
              <p className="fc-eyebrow">Curated by our architects</p>
              <h2 className="fc-title">
                Find a Design That Fits
                <br />
                <em>Your Lifestyle</em>
              </h2>
              <p className="fc-subtitle">
                From compact family bungalows to luxury maisonettes, every plan
                can be customized to your land and requirements.
              </p>
            </div>
            <div className="fc-header-right">
              <div className="fc-stat">
                <span className="fc-stat-num">
                  <em id="totalCount">{totalPlans}</em>+
                </span>
                <span className="fc-stat-label">Plans Available</span>
              </div>
            </div>
          </div>

          {/* CATEGORY RAIL */}
          <div className="fc-rail-wrapper animate-on-scroll">
            <div className="fc-rail" role="tablist">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`fc-cat ${c.id === activeId ? "active" : ""}`}
                  role="tab"
                  aria-selected={c.id === activeId}
                  onClick={() => setActiveId(c.id)}
                >
                  <span>
                    <span
                      className="fc-cat-dot"
                      style={{ background: c.dot }}
                    ></span>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN STAGE */}
          <div className="fc-stage animate-on-scroll" id="mainStage">
            {/* HERO */}
            <div
              className="fc-hero card-enter"
              key={`hero-${activeId}`}
              onMouseEnter={() => setIsHeroHovered(true)}
              onMouseLeave={() => setIsHeroHovered(false)}
              onClick={() => setSelectedDesignId(hero.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  setSelectedDesignId(hero.id);
              }}
            >
              <Image
                className="fc-hero-bg bg-fill"
                src={hero.img}
                alt={hero.name}
                fill
                sizes="(max-width: 900px) 100vw, 66vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="fc-hero-gradient"></div>
              {hero.badge && (
                <span
                  className="fc-side-badge"
                  style={{ top: "16px", right: "16px", fontSize: "10px" }}
                >
                  {iconTag}
                  {hero.badge}
                </span>
              )}
              <div className="fc-hero-content">
                <div className="fc-hero-tag">
                  {iconTag}&nbsp;{activeCol.label}
                </div>
                <div className="fc-hero-cat-label">Featured Plan</div>
                <div key={shimmerKey} className="fc-hero-name shimmer animate">
                  {hero.name}
                </div>
                <div className="fc-hero-meta">
                  <span className="fc-meta-item">
                    {iconBed}
                    <span>{hero.beds}</span>
                  </span>
                  <span className="fc-meta-item">
                    {iconSqft}
                    <span>{hero.sqft}</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="fc-hero-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedDesignId(hero.id);
                  }}
                >
                  View Plan {iconArrow}
                </button>
              </div>
              <div
                className="fc-progress"
                style={{
                  width: isHeroHovered ? "100%" : "0%",
                  transition: isHeroHovered
                    ? "width 3s linear"
                    : "width 0.3s ease",
                }}
              ></div>
            </div>

            {/* SIDE STACK */}
            <div className="fc-side">
              {[s1, s2, s3, s4].filter(Boolean).map((plan, i) => (
                <button
                  type="button"
                  className={`fc-side-card card-enter card-enter-delay-${i + 1}`}
                  key={`s${i}-${activeId}`}
                  onClick={() => plan && setSelectedDesignId(plan.id)}
                  style={{
                    display: "block",
                    textAlign: "left",
                    border: 0,
                    padding: 0,
                  }}
                >
                  <Image
                    className="fc-side-bg bg-fill"
                    src={plan?.img || ""}
                    alt={plan?.name || ""}
                    fill
                    sizes="(max-width: 900px) 50vw, 380px"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="fc-side-grad"></div>
                  {plan?.badge && (
                    <span className="fc-side-badge">{plan.badge}</span>
                  )}
                  <div className="fc-side-info">
                    <div className="fc-side-label">{activeCol.label}</div>
                    <div className="fc-side-name" style={{ fontSize: "13px" }}>
                      {plan?.name}
                    </div>
                    <div className="fc-side-beds">{plan?.beds}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM THUMBNAILS */}
          <div className="fc-bottom animate-on-scroll" id="bottomStrip">
            {mergedPlans.map((plan, i) => (
              <button
                type="button"
                key={`${activeId}-${i}`}
                className="fc-thumb card-enter"
                onClick={() => setSelectedDesignId(plan.id)}
                style={{
                  animationDelay: `${0.1 + i * 0.07}s`,
                  display: "block",
                  textAlign: "left",
                  border: 0,
                  padding: 0,
                }}
              >
                <Image
                  className="fc-thumb-bg bg-fill"
                  src={plan.img}
                  alt={plan.name}
                  fill
                  sizes="(max-width: 560px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="fc-thumb-overlay"></div>
                {plan.badge && (
                  <span className="fc-thumb-badge">{plan.badge}</span>
                )}
                <div className="fc-thumb-info">
                  <div className="fc-thumb-name">{plan.name}</div>
                  <div className="fc-thumb-meta">{plan.sqft}</div>
                </div>
              </button>
            ))}
          </div>

          {/* FOOTER */}
          <div className="fc-footer animate-on-scroll">
            <div className="fc-footer-left">
              <div className="fc-stat">
                <span className="fc-stat-num">
                  <em>{mergedPlans.length}</em>
                </span>
                <span className="fc-stat-label">Plans shown</span>
              </div>
              <div className="fc-stat-divider"></div>
              <div className="fc-stat">
                <span className="fc-stat-num">{activeCol.count}</span>
                <span className="fc-stat-label">In collection</span>
              </div>
              <div className="fc-stat-divider"></div>
              <span className="fc-showing">
                Browsing <strong>{activeCol.label}</strong>
              </span>
            </div>
            <div className="fc-footer-right">
              <Link
                href="#explorer"
                className="fc-btn-ghost"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Filter Plans
              </Link>
              <Link
                href={`/designs?category=${encodeURIComponent(activeCol.label)}`}
                className="fc-btn-primary"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                View Full Collection
                {iconArrow}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <DesignPreviewModal
        id={selectedDesignId}
        onClose={() => setSelectedDesignId(null)}
      />
    </div>
  );
}
