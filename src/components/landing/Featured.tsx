"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './Featured.css';

const collections = [
  {
    id: "modern", label: "Modern", dot: "#5B9FD6", count: 18,
    accent: "#5B9FD6",
    plans: [
      { name: "Eco Modern",         beds: "3 bed · 3 bath", sqft: "2,100 sqft", badge: null,       price: "KES 11.5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa7.jpg" },
      { name: "Vista Pavilion",     beds: "3 bed · 2 bath", sqft: "1,850 sqft", badge: null,       price: "KES 9.5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg" },
      { name: "Skyline Loft",       beds: "5 bed · 4 bath", sqft: "3,100 sqft", badge: "Popular",  price: "KES 16M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Top-Down_Aerial_View.jpg" },
      { name: "Zenith Flat-Roof",   beds: "3 bed · 3 bath", sqft: "2,050 sqft", badge: null,       price: "KES 11M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa1.jpg" },
      { name: "Linear House",       beds: "4 bed · 2 bath", sqft: "2,200 sqft", badge: null,       price: "KES 13M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Compound.jpg" },
      { name: "Urban Edge",         beds: "3 bed · 2 bath", sqft: "1,950 sqft", badge: null,       price: "KES 10M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa9.jpg" },
      { name: "Glass Pavilion",     beds: "4 bed · 3 bath", sqft: "2,600 sqft", badge: "Trendy",   price: "KES 14M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa8.jpg" },
      { name: "Horizon Residence",  beds: "4 bed · 3 bath", sqft: "2,400 sqft", badge: "New",      price: "KES 12M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg" },
    ]
  },
  {
    id: "luxury", label: "Luxury", dot: "#C49A3C", count: 14,
    accent: "#C49A3C",
    plans: [
      { name: "Grand Palazzo",      beds: "6 bed · 5 bath", sqft: "5,800 sqft", badge: "Exclusive",  price: "KES 45M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa2.jpg" },
      { name: "The Riviera",        beds: "5 bed · 5 bath", sqft: "4,900 sqft", badge: null,         price: "KES 38M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The_Guest_Wing1.jpg" },
      { name: "Monte Bellavista",   beds: "7 bed · 6 bath", sqft: "6,500 sqft", badge: "Top Rated",  price: "KES 52M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg" },
      { name: "Sunset Manor",       beds: "4 bed · 4 bath", sqft: "4,200 sqft", badge: null,         price: "KES 33M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa3.jpg" },
      { name: "The Windsor",        beds: "6 bed · 6 bath", sqft: "5,400 sqft", badge: null,         price: "KES 42M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The_Guest_Wing2.jpg" },
      { name: "Oasis Retreat",      beds: "5 bed · 5 bath", sqft: "5,100 sqft", badge: null,         price: "KES 40M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool2.jpg" },
      { name: "Crown Estate",       beds: "7 bed · 7 bath", sqft: "7,200 sqft", badge: "Premium",    price: "KES 60M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool3.jpg" },
      { name: "Royal Mansion",      beds: "6 bed · 5 bath", sqft: "6,000 sqft", badge: null,         price: "KES 48M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool4.jpg" },
    ]
  },
  {
    id: "bungalow", label: "Bungalows", dot: "#4EA870", count: 22,
    accent: "#4EA870",
    plans: [
      { name: "The Homestead",      beds: "3 bed · 2 bath", sqft: "1,600 sqft", badge: "Best Seller", price: "KES 7.5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow2.jpg" },
      { name: "Meadow Bungalow",    beds: "4 bed · 2 bath", sqft: "1,900 sqft", badge: null,          price: "KES 9M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow3.jpg" },
      { name: "Rosewood Cottage",   beds: "3 bed · 3 bath", sqft: "1,750 sqft", badge: "New",         price: "KES 8.2M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow4.jpg" },
      { name: "Prairie House",      beds: "4 bed · 3 bath", sqft: "2,100 sqft", badge: null,          price: "KES 10M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow5.jpg" },
      { name: "Garden Retreat",     beds: "3 bed · 2 bath", sqft: "1,500 sqft", badge: null,          price: "KES 7M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow6.jpg" },
      { name: "Oakwood Bungalow",   beds: "4 bed · 2 bath", sqft: "1,800 sqft", badge: null,          price: "KES 8.5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow7.jpg" },
      { name: "Sunrise Villa",      beds: "3 bed · 2 bath", sqft: "1,650 sqft", badge: "Popular",     price: "KES 7.8M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow8.jpg" },
      { name: "Harmony Home",       beds: "4 bed · 3 bath", sqft: "2,000 sqft", badge: null,          price: "KES 9.5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow9.jpg" },
    ]
  },
  {
    id: "duplex", label: "Duplex", dot: "#A85CB0", count: 11,
    accent: "#A85CB0",
    plans: [
      { name: "Twin Peaks Duplex",  beds: "2×3 bed · 2×2 bath", sqft: "3,200 sqft", badge: "Popular", price: "KES 22M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow7.jpg" },
      { name: "Mirror House",       beds: "2×4 bed · 2×3 bath", sqft: "3,800 sqft", badge: null,      price: "KES 26M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow8.jpg" },
      { name: "Urban Pair",         beds: "2×2 bed · 2×2 bath", sqft: "2,600 sqft", badge: "New",     price: "KES 18M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow9.jpg" },
      { name: "Symmetra",           beds: "2×3 bed · 2×3 bath", sqft: "3,400 sqft", badge: null,      price: "KES 24M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow10.jpg" },
      { name: "Duo Residence",      beds: "2×4 bed · 2×2 bath", sqft: "3,600 sqft", badge: null,      price: "KES 25M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow11.jpg" },
      { name: "City Twins",         beds: "2×3 bed · 2×2 bath", sqft: "3,000 sqft", badge: null,      price: "KES 20M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow12.jpg" },
      { name: "Split Level",        beds: "2×4 bed · 2×3 bath", sqft: "4,000 sqft", badge: "Premium", price: "KES 28M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow13.jpg" },
      { name: "Harmony Duplex",     beds: "2×3 bed · 2×3 bath", sqft: "3,300 sqft", badge: null,      price: "KES 23M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow14.jpg" },
    ]
  },
  {
    id: "smallplot", label: "Small Plot", dot: "#E06A50", count: 17,
    accent: "#E06A50",
    plans: [
      { name: "The Compact",          beds: "2 bed · 1 bath", sqft: "900 sqft",   badge: "Efficient", price: "KES 4.5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow12.jpg" },
      { name: "Urban Micro",           beds: "3 bed · 2 bath", sqft: "1,100 sqft", badge: null,        price: "KES 5.8M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow13.jpg" },
      { name: "Corner Plot Special",   beds: "3 bed · 2 bath", sqft: "1,250 sqft", badge: "Popular",   price: "KES 6.5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow14.jpg" },
      { name: "Space Saver",           beds: "2 bed · 2 bath", sqft: "980 sqft",   badge: null,        price: "KES 5M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow15.jpg" },
      { name: "The Petite",            beds: "3 bed · 1 bath", sqft: "1,050 sqft", badge: null,        price: "KES 5.2M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow16.jpg" },
      { name: "Mini Modern",           beds: "2 bed · 2 bath", sqft: "950 sqft",   badge: null,        price: "KES 4.8M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow_fenceview.jpg" },
      { name: "Smart Layout",          beds: "3 bed · 2 bath", sqft: "1,150 sqft", badge: "Clever",    price: "KES 6M",   img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow_gateview.jpg" },
      { name: "Tiny Villa",            beds: "2 bed · 1 bath", sqft: "850 sqft",   badge: null,        price: "KES 4.2M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg" },
    ]
  },
  {
    id: "contemporary", label: "Contemporary", dot: "#4FA3BF", count: 18,
    accent: "#4FA3BF",
    plans: [
      { name: "The Studio Home",    beds: "4 bed · 3 bath", sqft: "2,300 sqft", badge: "Award Win", price: "KES 14M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa4.jpg" },
      { name: "Cascade Residence",  beds: "5 bed · 4 bath", sqft: "2,900 sqft", badge: null,        price: "KES 18M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa5.jpg" },
      { name: "Open Concept",       beds: "3 bed · 3 bath", sqft: "2,000 sqft", badge: "New",       price: "KES 12M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa6.jpg" },
      { name: "Floating Volumes",   beds: "4 bed · 3 bath", sqft: "2,500 sqft", badge: null,        price: "KES 15M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa7.jpg" },
      { name: "The Glass House",    beds: "4 bed · 4 bath", sqft: "2,700 sqft", badge: "Popular",   price: "KES 17M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa8.jpg" },
      { name: "Geometric Villa",    beds: "5 bed · 5 bath", sqft: "3,200 sqft", badge: null,        price: "KES 20M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa9.jpg" },
      { name: "Luminous Block",     beds: "4 bed · 3 bath", sqft: "2,400 sqft", badge: "Sleek",     price: "KES 15M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_5-Storey_Apartment_Block_Rear_Elevation1.jpg" },
      { name: "Minimalist Retreat", beds: "3 bed · 2 bath", sqft: "1,800 sqft", badge: null,        price: "KES 11M", img: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_5-Storey_Apartment_Block_Side_Elevation1.jpg" },
    ]
  },
];

const iconBed = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
    <rect x="1" y="5" width="14" height="9" rx="1.5" />
    <path d="M1 10h14M5 10V7h6v3" />
  </svg>
);
const iconSqft = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
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
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="11" height="11">
    <path d="M9.5 2H3a1 1 0 00-1 1v6.5l6 6 6-6-4.5-7.5z" />
    <circle cx="5.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const CATEGORY_MAP: Record<string, string> = {
  "modern": "Modern",
  "luxury": "Luxury",
  "bungalow": "Bungalows",
  "duplex": "Duplex",
  "smallplot": "Small Plot",
  "contemporary": "Contemporary",
};

export default function Featured({ allDesigns = [] }: { allDesigns?: any[] }) {
  const [activeId, setActiveId] = useState(collections[0].id);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activeCol = collections.find(c => c.id === activeId);
  const totalPlans = collections.reduce((s, c) => s + c.count, 0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      const els = sectionRef.current.querySelectorAll('.animate-on-scroll');
      els.forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setShimmerKey(prev => prev + 1);
  }, [activeId]);

  if (!activeCol) return null;

  const dbCategoryName = CATEGORY_MAP[activeId] || activeCol.label;
  const categoryDbDesigns = allDesigns.filter(d => 
    d.category?.name?.toLowerCase() === dbCategoryName.toLowerCase() ||
    d.category?.name?.toLowerCase() === activeId.toLowerCase()
  );

  const mergedPlans = (function mergePlansWithFallback(dbDesigns: any[], fallbacks: any[], count: number) {
    const merged = dbDesigns.map(d => ({
      id: d.id,
      tag: d.category?.name,
      name: d.name,
      beds: `${d.bedrooms || 0} bed · ${d.bathrooms || 0} bath`,
      sqft: `${d.area || 0} sqft`,
      price: d.basePrice ? `KES ${d.basePrice.toLocaleString()}` : "",
      img: d.images?.[0]?.url || fallbacks[0]?.img || "",
      badge: d.isFeatured ? "Featured" : null,
    }));
    
    const remaining = count - merged.length;
    if (remaining > 0) {
      merged.push(...fallbacks.slice(0, remaining).map(f => ({
        ...f,
        id: undefined,
      })));
    }
    return merged.slice(0, count);
  })(categoryDbDesigns, activeCol.plans, activeCol.plans.length);

  const [hero, s1, s2, s3, s4] = mergedPlans;

  return (
    <div className="fc-container">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Barlow:wght@200;300;400;500;600&family=Barlow+Condensed:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <section className="fc" id="featured" aria-label="Featured House Plan Collections" ref={sectionRef}>
        <div className="fc-inner">

          {/* HEADER */}
          <div className="fc-header animate-on-scroll">
            <div className="fc-header-left">
              <p className="fc-eyebrow">Curated by our architects</p>
              <h2 className="fc-title">
                Find a Design That Fits<br /><em>Your Lifestyle</em>
              </h2>
              <p className="fc-subtitle">From compact family bungalows to luxury maisonettes, every plan can be customized to your land and requirements.</p>
            </div>
            <div className="fc-header-right">
              <div className="fc-stat">
                <span className="fc-stat-num"><em id="totalCount">{totalPlans}</em>+</span>
                <span className="fc-stat-label">Plans Available</span>
              </div>
            </div>
          </div>

          {/* CATEGORY RAIL */}
          <div className="fc-rail-wrapper animate-on-scroll">
            <div className="fc-rail" role="tablist">
              {collections.map(c => (
                <button 
                  key={c.id}
                  className={`fc-cat ${c.id === activeId ? 'active' : ''}`}
                  role="tab"
                  aria-selected={c.id === activeId}
                  onClick={() => setActiveId(c.id)}
                >
                  <span>
                    <span className="fc-cat-dot" style={{ background: c.dot }}></span>
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
            >
              <img className="fc-hero-bg bg-fill" src={hero.img} alt={hero.name} />
              <div className="fc-hero-gradient"></div>
              {hero.badge && <span className="fc-side-badge" style={{ top: '16px', right: '16px', fontSize: '10px' }}>{iconTag}{hero.badge}</span>}
              <div className="fc-hero-content">
                <div className="fc-hero-tag">{iconTag}&nbsp;{activeCol.label}</div>
                <div className="fc-hero-cat-label">Featured Plan</div>
                <div key={shimmerKey} className="fc-hero-name shimmer animate">{hero.name}</div>
                <div className="fc-hero-meta">
                  <span className="fc-meta-item">{iconBed}<span>{hero.beds}</span></span>
                  <span className="fc-meta-item">{iconSqft}<span>{hero.sqft}</span></span>
                  <span className="fc-meta-item" style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--gold)', fontWeight: 500, opacity: 1 }}>{hero.price}</span>
                </div>
                <Link href={hero.id ? `/designs/${hero.id}` : `/designs?category=${encodeURIComponent(activeCol.label)}`} className="fc-hero-cta" style={{ textDecoration: 'none' }}>
                  View Plan {iconArrow}
                </Link>
              </div>
              <div 
                className="fc-progress" 
                style={{ 
                  width: isHeroHovered ? '100%' : '0%',
                  transition: isHeroHovered ? 'width 3s linear' : 'width 0.3s ease' 
                }}
              ></div>
            </div>

            {/* SIDE STACK */}
            <div className="fc-side">
              {[s1, s2, s3, s4].map((plan, i) => (
                <Link 
                  href={plan?.id ? `/designs/${plan.id}` : `/designs?category=${encodeURIComponent(activeCol.label)}`}
                  className={`fc-side-card card-enter card-enter-delay-${i + 1}`} 
                  key={`s${i}-${activeId}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <img className="fc-side-bg bg-fill" src={plan?.img} alt={plan?.name} />
                  <div className="fc-side-grad"></div>
                  {plan?.badge && <span className="fc-side-badge">{plan.badge}</span>}
                  <div className="fc-side-info">
                    <div className="fc-side-label">{activeCol.label}</div>
                    <div className="fc-side-name" style={{ fontSize: '13px' }}>{plan?.name}</div>
                    <div className="fc-side-beds">{plan?.beds}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BOTTOM THUMBNAILS */}
          <div className="fc-bottom animate-on-scroll" id="bottomStrip">
            {mergedPlans.map((plan, i) => (
              <Link 
                href={plan.id ? `/designs/${plan.id}` : `/designs?category=${encodeURIComponent(activeCol.label)}`}
                key={`${activeId}-${i}`} 
                className="fc-thumb card-enter" 
                style={{ animationDelay: `${0.1 + i * 0.07}s`, textDecoration: 'none', display: 'block' }}
              >
                <img className="fc-thumb-bg bg-fill" src={plan.img} alt={plan.name} />
                <div className="fc-thumb-overlay"></div>
                {plan.badge && <span className="fc-thumb-badge">{plan.badge}</span>}
                <div className="fc-thumb-info">
                  <div className="fc-thumb-name">{plan.name}</div>
                  <div className="fc-thumb-meta">{plan.sqft} &middot; {plan.price}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* FOOTER */}
          <div className="fc-footer animate-on-scroll">
            <div className="fc-footer-left">
              <div className="fc-stat">
                <span className="fc-stat-num"><em>{mergedPlans.length}</em></span>
                <span className="fc-stat-label">Plans shown</span>
              </div>
              <div className="fc-stat-divider"></div>
              <div className="fc-stat">
                <span className="fc-stat-num">{activeCol.count}</span>
                <span className="fc-stat-label">In collection</span>
              </div>
              <div className="fc-stat-divider"></div>
              <span className="fc-showing">Browsing <strong>{activeCol.label}</strong></span>
            </div>
            <div className="fc-footer-right">
              <Link href="#explorer" className="fc-btn-ghost" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Filter Plans</Link>
              <Link 
                href={`/designs?category=${encodeURIComponent(activeCol.label)}`}
                className="fc-btn-primary" 
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={(e) => {
                  // Keep scroll behavior if staying on page, but since we are linking, we can omit it 
                  // or keep it if they prefer just scrolling down. The plan says "update to also pass category as query param to /designs?category=..."
                }}
              >
                View Full Collection
                {iconArrow}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}