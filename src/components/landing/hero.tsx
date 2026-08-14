"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "./DreamPlan.css";

const PLANS = [
  { tag: "Contemporary Villa", name: "The Maisonette", beds: "5 Bed · 4 Bath", area: "4,200 sqft", image: "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa2.jpg" },
  { tag: "Modern Bungalow", name: "The Zenith", beds: "3 Bed · 2 Bath", area: "1,850 sqft", image: "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow1.jpg" },
  { tag: "Apartment Block", name: "The Nexus", beds: "20 Units · Mixed", area: "15,000 sqft", image: "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg" },
  { tag: "Luxury Estate", name: "The Oasis Vista", beds: "6 Bed · 7 Bath", area: "6,500 sqft", image: "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg" },
  { tag: "Country Cottage", name: "English Retreat", beds: "4 Bed · 3 Bath", area: "2,600 sqft", image: "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage1.jpg" },
  { tag: "Townhouse Community", name: "Urban Haven", beds: "3 Bed · 3 Bath", area: "2,100 sqft", image: "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Streetscape1.jpg" },
  { tag: "Luxury Maisonette", name: "The Pinnacle", beds: "4 Bed · 4 Bath", area: "3,400 sqft", image: "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg" },
];

function getCardDestination(plan: any): string {
  if (plan.id) return `/designs/${plan.id}`;
  return `/designs?category=${encodeURIComponent(plan.category || plan.tag)}`;
}

function HouseCard({ plan, cardStyle }: any) {
  return (
    <Link href={getCardDestination(plan)} className="dp-house-card" style={{ ...cardStyle, textDecoration: "none" }}>
      <Image src={plan.image} alt={plan.name} className="dp-card-img-full" fill sizes="(max-width: 768px) 280px, 340px" />
      <div className="dp-card-overlay"><div className="dp-card-content">
        <div className="dp-card-tag">{plan.tag}</div>
        <div className="dp-card-name-row"><h3 className="dp-card-name">{plan.name}</h3><div className="dp-card-arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
      </div></div>
    </Link>
  );
}

function useCarousel(total: number, interval = 3800) {
  const [current, setCurrent] = useState(0);
  const [animated, setAnimated] = useState(false);
  const timerRef = useRef<any>(null);
  const goTo = useCallback((idx: number) => { const next = ((idx % total) + total) % total; setAnimated(true); setCurrent(next); }, [total]);
  const next = useCallback(() => goTo((current + 1) % total), [current, goTo, total]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total]);
  const resetTimer = useCallback(() => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = setInterval(next, interval); }, [next, interval]);
  useEffect(() => { timerRef.current = setInterval(next, interval); return () => clearInterval(timerRef.current); }, [next, interval]);
  const goToWithReset = useCallback((idx: number) => { goTo(idx); resetTimer(); }, [goTo, resetTimer]);
  return { current, animated, goTo: goToWithReset, next, prev };
}

function getCardPositions(current: number, total: number, stageW: number, stageH: number) {
  const W = 340, H = 440, cx = stageW / 2, cy = stageH / 2;
  return Array.from({ length: total }, (_, i) => {
    const offset = i - current, N = total;
    let tx: number, ty: number, tz: number, scale: number, opacity: number, zIndex: number, blur: number;
    if (offset === 0) { tx = cx - W / 2; ty = cy - H / 2; tz = 0; scale = 1; opacity = 1; zIndex = 10; blur = 0; }
    else if (offset === 1 || offset === -(N - 1)) { tx = cx - W / 2 + W * 0.62; ty = cy - H / 2 + H * 0.06; tz = -120; scale = 0.88; opacity = 0.7; zIndex = 8; blur = 1; }
    else if (offset === -1 || offset === N - 1) { tx = cx - W / 2 - W * 0.62; ty = cy - H / 2 + H * 0.06; tz = -120; scale = 0.88; opacity = 0.7; zIndex = 8; blur = 1; }
    else if (offset === 2 || offset === -(N - 2)) { tx = cx - W / 2 + W * 1.05; ty = cy - H / 2 + H * 0.14; tz = -240; scale = 0.72; opacity = 0.35; zIndex = 5; blur = 2; }
    else if (offset === -2 || offset === N - 2) { tx = cx - W / 2 - W * 1.05; ty = cy - H / 2 + H * 0.14; tz = -240; scale = 0.72; opacity = 0.35; zIndex = 5; blur = 2; }
    else { tx = cx - W / 2 + (offset > 0 ? W * 1.5 : -W * 1.5); ty = cy - H / 2 + H * 0.2; tz = -400; scale = 0.5; opacity = 0; zIndex = 1; blur = 4; }
    return { tx, ty, tz, scale, opacity, zIndex, blur };
  });
}

const BG_SLIDES = PLANS.map((p) => p.image).concat("https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Top-Down_Aerial_View.jpg");

function CinematicBackground() {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState(-1);
  useEffect(() => { const timer = setInterval(() => { setCurrent((prev) => { const next = (prev + 1) % BG_SLIDES.length; setLeaving(prev); return next; }); }, 8000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (leaving !== -1) { const t = setTimeout(() => setLeaving(-1), 1900); return () => clearTimeout(t); } }, [leaving]);
  return <div className="cinematic-bg-wrapper"><div className="vignette" /><div className="grain" /><div className="stage" id="bg-stage">{BG_SLIDES.map((src, i) => { const className = `slide${i === current ? " active" : i === leaving ? " leaving" : ""}`; return <div key={i} className={className}><div className="slide__img"><Image src={src} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} priority={i === 0} quality={60} /></div><div className="slide__grade" /></div>; })}</div></div>;
}

export default function DreamPlan({ featuredDesigns = [] }: { featuredDesigns?: any[] }) {
  const mergedPlans = (() => {
    const merged = featuredDesigns.map((d) => ({ id: d.id, tag: d.category?.name || "Featured", name: d.name, beds: `${d.bedrooms || 0} Bed · ${d.bathrooms || 0} Bath`, area: `${d.area || 0} sqft`, image: d.images?.[0]?.url || PLANS[0].image, category: d.category?.name }));
    return [...merged, ...PLANS.slice(0, Math.max(0, 7 - merged.length))].slice(0, 7);
  })();
  const N = mergedPlans.length || PLANS.length;
  const plans = mergedPlans.length ? mergedPlans : PLANS;
  const { current, animated, goTo, next, prev } = useCarousel(N, 3800);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageDims, setStageDims] = useState({ w: 500, h: 580 });
  const touchStartX = useRef(0);
  useEffect(() => { const measure = () => { if (stageRef.current) setStageDims({ w: stageRef.current.offsetWidth, h: stageRef.current.offsetHeight }); }; measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, []);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [next, prev]);
  const positions = getCardPositions(current, N, stageDims.w, stageDims.h);

  return <div className="dreamplan-root">
    <section className="dp-hero" id="hero">
      <CinematicBackground />
      <div className="dp-hero-body">
        <div className="dp-hero-text">
          <div className="dp-hero-eyebrow"><span className="dp-eyebrow-line" /><span className="dp-eyebrow-text">Architecture for the way you want to live</span></div>
          <h1 className="dp-hero-headline leading-tight tracking-tight">A Better House<br />Starts With a Better<br /><em>Plan.</em></h1>
          <p className="dp-hero-sub">Beautiful, practical house plans designed around your land, your budget and your family — with the detail you need to build with confidence.</p>
          <div className="dp-hero-actions">
            <a href="#explorer" className="dp-btn-primary">Explore House Plans <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            <a href="#consultation-form" className="dp-btn-secondary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> Design My Home</a>
          </div>
          <div className="dp-hero-stats">
            <div className="dp-stat-item"><div className="dp-stat-number">1,500+</div><div className="dp-stat-label">House Plan Designs</div></div>
            <div className="dp-stat-item"><div className="dp-stat-number">20+</div><div className="dp-stat-label">Years of Experience</div></div>
          </div>
        </div>
        <div className="dp-hero-visual">
          <div className="dp-stage" ref={stageRef} onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 40) dx < 0 ? next() : prev(); }}>
            <div className="dp-stage-inner">{plans.map((plan, i) => { const pos = positions[i]; const transition = animated ? "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.7s ease, filter 0.7s ease" : "none"; return <HouseCard key={plan.name + i} plan={plan} cardStyle={{ transform: `translate(${pos.tx}px, ${pos.ty}px) translateZ(${pos.tz}px) scale(${pos.scale})`, opacity: pos.opacity, zIndex: pos.zIndex, filter: `blur(${pos.blur}px)`, transition, cursor: "pointer" }} />; })}</div>
          </div>
          <div className="dp-carousel-nav">{plans.map((_, i) => <button key={i} className={`dp-dot${i === current ? " dp-dot--active" : ""}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />)}</div>
          <div className="dp-float-badge"><div className="dp-badge-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 3.1L12 4.6l-2.5 2.4.6 3.4L7 8.9l-3.1 1.5.6-3.4L2 4.6l3.5-.5L7 1z" fill="#C9A96E" /></svg></div><div className="dp-badge-title">Featured Designs</div><div className="dp-badge-sub">Built around real lifestyles</div></div>
        </div>
      </div>
      <div className="dp-scroll-hint"><div className="dp-scroll-line" /><span className="dp-scroll-text">Explore our designs</span></div>
    </section>
  </div>;
}
