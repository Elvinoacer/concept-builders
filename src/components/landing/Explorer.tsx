"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import "./Explorer.css";
import DesignModal from "./DesignModal";

type LandingDesign = {
  id?: string;
  name: string;
  category?: { name?: string | null } | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  basePrice?: number;
  features?: string[];
  images?: { url: string }[];
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
  features: string[];
  basePrice?: number;
  hasFiles?: boolean;
  height: number;
};

const allPlans: Array<
  Omit<ExplorerPlan, "id" | "basePrice" | "hasFiles"> & { id: number }
> = [
  {
    id: 0,
    tags: ["modern", "4bed"],
    name: "The Horizon House",
    style: "Modern",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow1.jpg",
    features: [
      "Open-plan kitchen & living area",
      "Floor-to-ceiling glass facade",
      "Private rooftop terrace",
      "Double garage with EV charging",
      "Energy-rated insulation system",
    ],
    height: 260,
  },
  {
    id: 1,
    tags: ["luxury", "5bed"],
    name: "Palazzo Estate",
    style: "Luxury",
    beds: 5,
    baths: 4.5,
    sqft: "5,800",
    img: "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg",
    features: [
      "Grand entrance foyer with chandelier",
      "Home theatre & wine cellar",
      "Infinity pool with cabana",
      "Smart home automation throughout",
      "Separate guest suite with kitchenette",
    ],
    height: 320,
  },
  {
    id: 2,
    tags: ["minimalist", "3bed"],
    name: "Pure Form Residence",
    style: "Minimalist",
    beds: 3,
    baths: 2,
    sqft: "1,950",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa1.jpg",
    features: [
      "Clean flat-roof silhouette",
      "Concrete & timber material palette",
      "Hidden storage throughout",
      "Zen courtyard garden",
      "Passive cooling design",
    ],
    height: 230,
  },
  {
    id: 3,
    tags: ["bungalow", "3bed"],
    name: "Garden Bungalow",
    style: "Bungalow",
    beds: 3,
    baths: 2,
    sqft: "1,740",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow2.jpg",
    features: [
      "Wraparound veranda",
      "Low-maintenance landscaping",
      "Open-plan family spaces",
      "Solar-ready roof structure",
      "Accessible single-level layout",
    ],
    height: 280,
  },
  {
    id: 4,
    tags: ["duplex", "4bed"],
    name: "Twin Towers Duplex",
    style: "Duplex",
    beds: 4,
    baths: 3,
    sqft: "2,900",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow7.jpg",
    features: [
      "Two fully self-contained units",
      "Shared underground parking",
      "Separate utility meters",
      "Rental income potential",
      "Soundproofed party wall",
    ],
    height: 295,
  },
  {
    id: 5,
    tags: ["modern", "luxury", "5bed"],
    name: "Canopy Villa",
    style: "Luxury",
    beds: 5,
    baths: 5,
    sqft: "6,200",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa2.jpg",
    features: [
      "Private forest backdrop",
      "Three-car garage",
      "Home office suite",
      "Spa & gym pavilion",
      "Full perimeter security system",
    ],
    height: 250,
  },
  {
    id: 6,
    tags: ["minimalist", "modern", "4bed"],
    name: "White Line House",
    style: "Minimalist",
    beds: 4,
    baths: 3,
    sqft: "2,600",
    img: "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",
    features: [
      "All-white exterior cladding",
      "Floating staircase feature",
      "Sky bridge connecting wings",
      "Built-in furniture throughout",
      "Integrated solar panels",
    ],
    height: 270,
  },
  {
    id: 7,
    tags: ["bungalow", "4bed"],
    name: "Courtyard Bungalow",
    style: "Bungalow",
    beds: 4,
    baths: 3,
    sqft: "2,200",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow3.jpg",
    features: [
      "Central open courtyard",
      "Covered outdoor dining area",
      "Master suite with walk-in closet",
      "Pitched timber ceiling in living room",
      "Rainwater harvesting system",
    ],
    height: 240,
  },
  {
    id: 8,
    tags: ["modern", "3bed"],
    name: "Terrace Modern",
    style: "Modern",
    beds: 3,
    baths: 2.5,
    sqft: "2,100",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa8.jpg",
    features: [
      "Cascading terrace levels",
      "Large sliding glass doors",
      "Chef's island kitchen",
      "Polished concrete floors",
      "Landscaped front garden",
    ],
    height: 290,
  },
  {
    id: 9,
    tags: ["luxury", "duplex", "5bed"],
    name: "Imperial Duplex",
    style: "Luxury",
    beds: 5,
    baths: 4,
    sqft: "4,400",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/The_Guest_Wing1.jpg",
    features: [
      "Statement marble staircase",
      "Private balcony per unit",
      "High-speed fibre pre-wired",
      "Separate entrances per unit",
      "Premium sanitary ware",
    ],
    height: 310,
  },
  {
    id: 10,
    tags: ["minimalist", "3bed"],
    name: "Quiet Geometry",
    style: "Minimalist",
    beds: 3,
    baths: 2,
    sqft: "1,680",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Top-Down_Aerial_View.jpg",
    features: [
      "Geometric facade detailing",
      "Hidden door hardware",
      "Monochrome interior palette",
      "Fully insulated slab floor",
      "Skylights throughout hallways",
    ],
    height: 255,
  },
  {
    id: 11,
    tags: ["modern", "luxury", "4bed"],
    name: "Glass Ridge",
    style: "Modern",
    beds: 4,
    baths: 3.5,
    sqft: "3,400",
    img: "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa7.jpg",
    features: [
      "Double-height glazed living wall",
      "Cantilevered upper floor",
      "Private pool & sun deck",
      "Home automation hub",
      "Natural stone cladding",
    ],
    height: 275,
  },
];

export default function Explorer({
  allDesigns = [],
}: {
  allDesigns?: LandingDesign[];
}) {
  const mergedPlans = (function mergePlansWithFallback(
    dbDesigns: LandingDesign[],
    fallbacks: Array<
      Omit<ExplorerPlan, "id" | "basePrice" | "hasFiles"> & { id: number }
    >,
    count: number,
  ) {
    const merged: ExplorerPlan[] = dbDesigns.map((d) => {
      let catSlug = d.category?.name?.toLowerCase() || "";
      if (catSlug === "bungalows") catSlug = "bungalow";

      return {
        id: d.id,
        tags: [catSlug, `${d.bedrooms || 0}bed`].filter(Boolean),
        name: d.name,
        style: d.category?.name || "Modern",
        beds: d.bedrooms || 0,
        baths: d.bathrooms || 0,
        sqft: `${d.area ? d.area.toLocaleString() : 0}`,
        img: d.images?.[0]?.url || fallbacks[0]?.img || "",
        features:
          (d.features?.length ?? 0) > 0
            ? (d.features ?? [])
            : fallbacks[0]?.features || [],
        basePrice: d.basePrice,
        hasFiles: Boolean(
          d.architecturalDesign?.pdfFiles?.length ||
            d.structuralDesign?.pdfFiles?.length,
        ),
        height: 260,
      };
    });

    const remaining = count - merged.length;
    if (remaining > 0) {
      merged.push(
        ...fallbacks.slice(0, remaining).map((f) => ({
          ...f,
          id: undefined,
        })),
      );
    }
    return merged.slice(0, count);
  })(allDesigns, allPlans, 12);

  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all"]),
  );
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof mergedPlans)[0] | null
  >(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use refs for transient interaction state to avoid re-triggering the RAF effect
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const selectedPlanRef = useRef<(typeof mergedPlans)[0] | null>(null);

  // Keep a separate dragging state only used to gate click handler
  const [isDragging, setIsDragging] = useState(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Sync selectedPlan into ref so the RAF loop can read it without being a dep
  useEffect(() => {
    selectedPlanRef.current = selectedPlan;
  }, [selectedPlan]);

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
      if (e.key === "Escape") setSelectedPlan(null);
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
        !selectedPlanRef.current
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
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseLeaveSlider = () => {
    isDraggingRef.current = false;
    isHoveredRef.current = false;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
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
    setSelectedPlan(plan);
  };

  return (
    <section className="ex-section" id="explorer" ref={sectionRef}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

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
            {["all", "modern", "luxury", "minimalist", "bungalow"].map((f) => (
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

      <DesignModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </section>
  );
}
