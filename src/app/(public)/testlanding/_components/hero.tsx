"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import "./DreamPlan.css";

// ── House plan data ──
const PLANS = [
  {
    tag: "Contemporary Villa",
    name: "The Maisonette",
    beds: "5 Bed · 4 Bath",
    area: "4,200 sqft",
    price: "$3,800",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa2.jpg",
  },
  {
    tag: "Modern Bungalow",
    name: "The Zenith",
    beds: "3 Bed · 2 Bath",
    area: "1,850 sqft",
    price: "$1,600",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg",
  },
  {
    tag: "Apartment Block",
    name: "The Nexus",
    beds: "20 Units · Mixed",
    area: "15,000 sqft",
    price: "$12,000",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",
  },
  {
    tag: "Luxury Estate",
    name: "The Oasis Vista",
    beds: "6 Bed · 7 Bath",
    area: "6,500 sqft",
    price: "$5,200",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg",
  },
  {
    tag: "Country Cottage",
    name: "English Retreat",
    beds: "4 Bed · 3 Bath",
    area: "2,600 sqft",
    price: "$2,100",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%20Luxury%20English%20Country%20Cottage1.jpg",
  },
  {
    tag: "Townhouse Community",
    name: "Urban Haven",
    beds: "3 Bed · 3 Bath",
    area: "2,100 sqft",
    price: "$1,850",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Townhouse_Community_Streetscape1.jpg",
  },
  {
    tag: "Luxury Maisonette",
    name: "The Pinnacle",
    beds: "4 Bed · 4 Bath",
    area: "3,400 sqft",
    price: "$2,900",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg",
  },
];



// ── HouseCard ──
function HouseCard({ plan, cardStyle, onClick }) {
  return (
    <div className="dp-house-card" style={cardStyle} onClick={onClick}>
      <img src={plan.image} alt={plan.name} className="dp-card-img-full" />
      <div className="dp-card-overlay">
        <div className="dp-card-content">
          <div className="dp-card-tag">{plan.tag}</div>
          <div className="dp-card-name-row">
            <h3 className="dp-card-name">{plan.name}</h3>
            <div className="dp-card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Carousel Logic ──
function useCarousel(total, interval = 3800) {
  const [current, setCurrent] = useState(0);
  const [animated, setAnimated] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    const next = ((idx % total) + total) % total;
    setAnimated(true);
    setCurrent(next);
  }, [total]);

  const next = useCallback(() => goTo((current + 1) % total), [current, goTo, total]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, interval);
  }, [next, interval]);

  useEffect(() => {
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [next, interval]);

  const goToWithReset = useCallback((idx) => {
    goTo(idx);
    resetTimer();
  }, [goTo, resetTimer]);

  return { current, animated, goTo: goToWithReset, next, prev };
}

// ── Carousel card position calculator ──
function getCardPositions(current, total, stageW, stageH) {
  const W = 340; // --card-w
  const H = 440; // --card-h
  const cx = stageW / 2;
  const cy = stageH / 2;

  return Array.from({ length: total }, (_, i) => {
    const offset = i - current;
    const N = total;
    let tx, ty, tz, scale, opacity, zIndex, blur;

    if (offset === 0) {
      tx = cx - W / 2; ty = cy - H / 2; tz = 0;
      scale = 1; opacity = 1; zIndex = 10; blur = 0;
    } else if (offset === 1 || offset === -(N - 1)) {
      tx = cx - W / 2 + W * 0.62; ty = cy - H / 2 + H * 0.06; tz = -120;
      scale = 0.88; opacity = 0.7; zIndex = 8; blur = 1;
    } else if (offset === -1 || offset === (N - 1)) {
      tx = cx - W / 2 - W * 0.62; ty = cy - H / 2 + H * 0.06; tz = -120;
      scale = 0.88; opacity = 0.7; zIndex = 8; blur = 1;
    } else if (offset === 2 || offset === -(N - 2)) {
      tx = cx - W / 2 + W * 1.05; ty = cy - H / 2 + H * 0.14; tz = -240;
      scale = 0.72; opacity = 0.35; zIndex = 5; blur = 2;
    } else if (offset === -2 || offset === (N - 2)) {
      tx = cx - W / 2 - W * 1.05; ty = cy - H / 2 + H * 0.14; tz = -240;
      scale = 0.72; opacity = 0.35; zIndex = 5; blur = 2;
    } else {
      tx = cx - W / 2 + (offset > 0 ? W * 1.5 : -W * 1.5);
      ty = cy - H / 2 + H * 0.2; tz = -400;
      scale = 0.5; opacity = 0; zIndex = 1; blur = 4;
    }

    return { tx, ty, tz, scale, opacity, zIndex, blur };
  });
}

// ── Cinematic Background ──
const BG_SLIDES = [
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa2.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%20Luxury%20English%20Country%20Cottage1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Townhouse_Community_Streetscape1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Top-Down_Aerial_View.jpg"
];

function CinematicBackground() {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState(-1);
  const [playCounts, setPlayCounts] = useState(Array(BG_SLIDES.length).fill(0));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % BG_SLIDES.length;
        setLeaving(prev);
        setPlayCounts((counts) => {
          const newCounts = [...counts];
          newCounts[next]++;
          return newCounts;
        });
        return next;
      });
    }, 8000); // --dur
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (leaving !== -1) {
      const t = setTimeout(() => {
        setLeaving(-1);
      }, 1900); // --trans (1.8s) + 100ms
      return () => clearTimeout(t);
    }
  }, [leaving]);

  return (
    <div className="cinematic-bg-wrapper">
      <div className="vignette"></div>
      <div className="grain"></div>
      <div className="stage" id="bg-stage">
        {BG_SLIDES.map((src, i) => {
          let className = "slide";
          if (i === current) className += " active";
          else if (i === leaving) className += " leaving";

          return (
            <div key={i} className={className}>
              <div 
                key={`${i}-${playCounts[i]}`} 
                className="slide__img" 
                style={{ backgroundImage: `url('${src}')` }}
              />
              <div className="slide__grade" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main DreamPlan Component ──
export default function DreamPlan() {
  const N = PLANS.length;
  const { current, animated, goTo, next, prev } = useCarousel(N, 3800);
  const stageRef = useRef(null);
  const [stageDims, setStageDims] = useState({ w: 500, h: 580 });
  const touchStartX = useRef(0);

  // Measure stage
  useEffect(() => {
    function measure() {
      if (stageRef.current) {
        setStageDims({
          w: stageRef.current.offsetWidth,
          h: stageRef.current.offsetHeight,
        });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch support
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }

  const positions = getCardPositions(current, N, stageDims.w, stageDims.h);

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="dreamplan-root">
        {/* ─── HERO ─── */}
        <section className="dp-hero" id="hero">
          <CinematicBackground />

          <div className="dp-hero-body">

            {/* LEFT: TEXT */}
            <div className="dp-hero-text">
              <div className="dp-hero-eyebrow">
                <span className="dp-eyebrow-line" />
                <span className="dp-eyebrow-text">Award-winning Architecture</span>
              </div>

              <h1 className="dp-hero-headline">
                Design Your<br />
                Dream Home<br />
                <em>Before You Build It</em>
              </h1>

              <p className="dp-hero-sub">
                Explore 100+ professionally designed house plans tailored for modern living.
                From luxury villas to contemporary bungalows — every plan crafted to perfection.
              </p>

              <div className="dp-hero-actions">
                <a href="#explorer" className="dp-btn-primary">
                  View House Plans
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#journey" className="dp-btn-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
                    <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="currentColor" />
                  </svg>
                  Watch the Story
                </a>
              </div>

              <div className="dp-hero-stats">
                <div className="dp-stat-item">
                  <div className="dp-stat-number">100+</div>
                  <div className="dp-stat-label">House Plans</div>
                </div>
                <div className="dp-stat-item">
                  <div className="dp-stat-number">2,400+</div>
                  <div className="dp-stat-label">Homes Built</div>
                </div>
                <div className="dp-stat-item">
                  <div className="dp-stat-number">18yr</div>
                  <div className="dp-stat-label">Experience</div>
                </div>
              </div>
            </div>

            {/* RIGHT: CAROUSEL */}
            <div className="dp-hero-visual">
              <div
                className="dp-stage"
                ref={stageRef}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <div className="dp-stage-inner">
                  {PLANS.map((plan, i) => {
                    const pos = positions[i];
                    const transition = animated
                      ? "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.7s ease, filter 0.7s ease"
                      : "none";
                    const cardStyle = {
                      transform: `translate(${pos.tx}px, ${pos.ty}px) translateZ(${pos.tz}px) scale(${pos.scale})`,
                      opacity: pos.opacity,
                      zIndex: pos.zIndex,
                      filter: `blur(${pos.blur}px)`,
                      transition,
                      cursor: i === current ? "default" : "pointer",
                    };
                    return (
                      <HouseCard
                        key={plan.name}
                        plan={plan}
                        cardStyle={cardStyle}
                        onClick={() => goTo(i)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Dots */}
              <div className="dp-carousel-nav">
                {PLANS.map((_, i) => (
                  <button
                    key={i}
                    className={`dp-dot${i === current ? " dp-dot--active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Floating badge */}
              <div className="dp-float-badge">
                <div className="dp-badge-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1l1.5 3.1L12 4.6l-2.5 2.4.6 3.4L7 8.9l-3.1 1.5.6-3.4L2 4.6l3.5-.5L7 1z" fill="#C9A96E" />
                  </svg>
                </div>
                <div className="dp-badge-title">Featured Collection</div>
                <div className="dp-badge-sub">Modern Luxury · 2025</div>
              </div>
            </div>

          </div>{/* /hero-body */}

          {/* Scroll hint */}
          <div className="dp-scroll-hint">
            <div className="dp-scroll-line" />
            <span className="dp-scroll-text">Scroll to explore</span>
          </div>

        </section>
      </div>
    </>
  );
}