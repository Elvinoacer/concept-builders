"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import "./Explorer.css";
import DesignPreviewModal from "@/components/design-showcase/DesignPreviewModal";

type LandingDesign = {
  id?: string;
  name: string;
  category?: { name?: string | null } | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  basePrice?: number;
  features?: string[];
  images?: { url: string; type?: string | null }[];
  architecturalDesign?: { pdfFiles?: unknown[] } | null;
  structuralDesign?: { pdfFiles?: unknown[] } | null;
};

type ExplorerPlan = {
  id?: string;
  tags: string[];
  name: string;
  style: string;
  beds: number | string;
  baths: number | string;
  sqft: string;
  img: string;
  basePrice?: number;
  hasFiles?: boolean;
  height: number;
};

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

export default function Explorer({
  allDesigns = [],
}: {
  allDesigns?: LandingDesign[];
}) {
  const mergedPlans = React.useMemo<ExplorerPlan[]>(
    () =>
      allDesigns
        .map((design, index) => {
          const firstImage = design.images?.find(isDisplayImage);
          if (!design.id || !firstImage?.url) return null;

          const categoryName = design.category?.name || "House Plans";
          const categorySlug = toSlug(categoryName);

          return {
            id: design.id,
            tags: [categorySlug, `${design.bedrooms || 0}bed`].filter(Boolean),
            name: design.name,
            style: categoryName,
            beds: design.bedrooms ?? "—",
            baths: design.bathrooms ?? "—",
            sqft: design.area ? design.area.toLocaleString() : "—",
            img: firstImage.url,
            features: design.features ?? [],
            basePrice: design.basePrice,
            hasFiles: Boolean(
              design.architecturalDesign?.pdfFiles?.length ||
                design.structuralDesign?.pdfFiles?.length,
            ),
            height: 240 + (index % 4) * 20,
          };
        })
        .filter((plan): plan is ExplorerPlan => Boolean(plan))
        .slice(0, 12),
    [allDesigns],
  );

  const styleFilters = React.useMemo(
    () =>
      Array.from(new Set(mergedPlans.map((plan) => toSlug(plan.style)))).slice(
        0,
        5,
      ),
    [mergedPlans],
  );

  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all"]),
  );
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use refs for transient interaction state to avoid re-triggering the RAF effect
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const selectedDesignIdRef = useRef<string | null>(null);

  // Keep a separate dragging state only used to gate click handler
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Sync selectedPlan into ref so the RAF loop can read it without being a dep
  useEffect(() => {
    selectedDesignIdRef.current = selectedDesignId;
  }, [selectedDesignId]);

  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("ex-revealed");
          }
        });
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      const els = sectionRef.current.querySelectorAll(".ex-reveal");
      els.forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDesignId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Parallax + Auto-Scroll Engine
  // Only re-mount this effect when the visible plan count changes (filter change),
  // NOT on every hover/drag/selectedPlan state change — those are read via refs.
  const visibleCount = mergedPlans.filter(
    (plan) =>
      activeFilters.has("all") || plan.tags.some((t) => activeFilters.has(t)),
  ).length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rAF: number;
    let scrollDirection = 1;
    let active = true;

    const engine = () => {
      if (!active) return;

      // 1. Auto-Scroll logic — reads refs, no state deps
      if (
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        !selectedDesignIdRef.current
      ) {
        track.scrollLeft += 0.8 * scrollDirection;
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
          scrollDirection = -1;
        } else if (track.scrollLeft <= 0) {
          scrollDirection = 1;
        }
      }

      // 2. Parallax logic
      const windowCenter = window.innerWidth / 2;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const offset = cardCenter - windowCenter;
        const maxOffset = Math.max(
          windowCenter * 0.5,
          windowCenter - rect.width / 2,
        );
        let normalizedOffset = offset / maxOffset;
        normalizedOffset = Math.max(-1, Math.min(1, normalizedOffset));
        const parallaxPos = 50 + normalizedOffset * 50;
        card.style.setProperty("--parallax-pos", `${parallaxPos}%`);
      });

      rAF = requestAnimationFrame(engine);
    };

    rAF = requestAnimationFrame(engine);

    return () => {
      active = false;
      cancelAnimationFrame(rAF);
    };
    // Only re-run when visible card count changes (i.e. filters change)
  }, [visibleCount]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (filter === "all") return new Set(["all"]);
      next.delete("all");
      if (next.has(filter)) {
        next.delete(filter);
        if (next.size === 0) next.add("all");
      } else next.add(filter);
      return next;
    });
  };

  const visiblePlans = mergedPlans.filter(
    (plan) =>
      activeFilters.has("all") || plan.tags.some((t) => activeFilters.has(t)),
  );

  // Stable key per plan — no Math.random()
  const getPlanKey = useCallback(
    (plan: (typeof mergedPlans)[0], index: number) =>
      plan.id != null ? String(plan.id) : `fallback-${index}`,
    [],
  );

  // Drag Handlers — use refs to avoid re-triggering the RAF effect
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseLeaveSlider = () => {
    isDraggingRef.current = false;
    isHoveredRef.current = false;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMoveSlider = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    e.preventDefault();
    hasDraggedRef.current = true;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2.5;
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleCardClick = (plan: (typeof mergedPlans)[0]) => {
    if (hasDraggedRef.current) return;
    setSelectedDesignId(plan.id);
  };

  return (
    <section className="ex-section" id="explorer" ref={sectionRef}>
      <div className="ex-container">
        {/* HEADER */}
        <div className="ex-section-header ex-reveal">
          <div className="ex-header-left">
            <p className="ex-eyebrow">Design Gallery</p>
            <h2 className="ex-section-title">
              Not Every Plan Works
              <br />
              for <em>Every Plot</em>
            </h2>
            <p
              className="ex-section-subtitle"
              style={{
                color: "var(--text-muted)",
                marginTop: "0.5rem",
                maxWidth: "400px",
              }}
            >
              Filter by plot size, budget, and style to find a design that fits
              your reality.
            </p>
          </div>
          <div className="ex-result-count">
            <span>{visiblePlans.length}</span> designs shown
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="ex-filter-bar ex-reveal ex-delay-1">
          <span className="ex-filter-label">Style</span>
          <div className="ex-filter-group">
            {["all", ...styleFilters].map((f) => (
              <button
                key={f}
                className={`ex-pill ${activeFilters.has(f) ? "active" : ""}`}
                onClick={() => toggleFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="ex-filter-divider"></div>
          <span className="ex-filter-label">Bedrooms</span>
          <div className="ex-filter-group">
            {["3bed", "4bed", "5bed", "duplex"].map((f) => (
              <button
                key={f}
                className={`ex-pill ${activeFilters.has(f) ? "active" : ""}`}
                onClick={() => toggleFilter(f)}
              >
                {f === "duplex" ? "Duplex" : f.replace("bed", " Bed")}
              </button>
            ))}
          </div>
        </div>

        {/* CINEMATIC SLIDER */}
        {visiblePlans.length > 0 ? (
          <div className="ex-slider-wrap ex-reveal ex-delay-2">
            <div
              className="ex-slider-track"
              ref={trackRef}
              onMouseEnter={() => {
                isHoveredRef.current = true;
              }}
              onMouseLeave={handleMouseLeaveSlider}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMoveSlider}
              onTouchStart={() => {
                isHoveredRef.current = true;
              }}
              onTouchEnd={() => {
                isHoveredRef.current = false;
              }}
            >
              {visiblePlans.map((plan, i) => (
                <div
                  className="ex-slider-card"
                  key={getPlanKey(plan, i)}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onClick={() => handleCardClick(plan)}
                  onMouseMove={(e) => {
                    if (isDraggingRef.current) return;
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -6;
                    const rotateY = ((x - centerX) / centerX) * 6;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                  }}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="ex-card-img-wrap">
                    <Image
                      src={plan.img}
                      className="ex-card-img-backdrop"
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 380px"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="ex-card-img-parallax">
                      <Image
                        src={plan.img}
                        alt={plan.name}
                        draggable="false"
                        fill
                        sizes="(max-width: 900px) 100vw, 380px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <div className="ex-card-tags">
                    <span className="ex-tag ex-tag-style">{plan.style}</span>
                    <span className="ex-tag ex-tag-beds">{plan.beds} Bed</span>
                  </div>
                  <div className="ex-slider-overlay">
                    <div className="ex-slider-content-inner">
                      <p className="ex-card-name">{plan.name}</p>
                      <div className="ex-card-meta">
                        <span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M2 14V6l6-4 6 4v8H10V9H6v5z" />
                          </svg>
                          {plan.beds} bed · {plan.baths} bath
                        </span>
                        <span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect x="2" y="2" width="12" height="12" rx="1" />
                            <path d="M2 6h12M6 10h4" />
                          </svg>
                          {plan.sqft} sq ft
                        </span>
                      </div>
                      <div className="ex-overlay-cta">
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="8" cy="8" r="6" />
                          <path d="M8 5v3l2 2" />
                        </svg>
                        Explore Details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="ex-empty-state">
            <p>No designs match that filter — try another combination.</p>
          </div>
        )}
      </div>

      <DesignPreviewModal
        id={selectedDesignId}
        onClose={() => setSelectedDesignId(null)}
      />
    </section>
  );
}
