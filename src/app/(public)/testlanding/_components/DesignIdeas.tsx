"use client";

import React, { useEffect, useRef, useState } from 'react';
import './DesignIdeas.css';

export default function DesignIdeas() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // For cursor animation
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Custom cursor movement
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouse.current.x + 'px';
        dotRef.current.style.top = mouse.current.y + 'px';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animateCursor = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px';
        ringRef.current.style.top = ringPos.current.y + 'px';
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Scroll progress bar
    const handleScroll = () => {
      if (progressBarRef.current) {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progressBarRef.current.style.width = ((scrolled / total) * 100) + '%';
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for reveals
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          if (observerRef.current) {
            observerRef.current.unobserve(e.target);
          }
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    const revealElements = document.querySelectorAll('.di-wrapper .card, .di-wrapper .step, .di-wrapper .mini-card, .di-wrapper .reveal');
    revealElements.forEach(el => observerRef.current?.observe(el));

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleLinkEnter = () => {
    document.querySelector('.di-wrapper')?.classList.add('link-hovered');
  };
  
  const handleLinkLeave = () => {
    document.querySelector('.di-wrapper')?.classList.remove('link-hovered');
  };

  return (
    <div className="di-wrapper">
      {/* Custom cursor */}
      <div id="cursor-dot" className="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" className="cursor-ring" ref={ringRef}></div>

      {/* Progress reading indicator */}
      <div 
        ref={progressBarRef}
        style={{
          position: 'fixed', top: 0, left: 0, height: '2px', width: '0%',
          background: 'linear-gradient(to right, #b8935a, #c8a96e)',
          zIndex: 1000, transition: 'width .1s linear', pointerEvents: 'none'
        }}
      ></div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <p className="hero-eyebrow">Design Ideas Library</p>
        <h1>Where <em>Great</em><br/>Homes Begin</h1>
        <p className="hero-sub">
          Curated collections of architecture that inspire. Explore design concepts, discover trending styles, and find the blueprint for your perfect home.
        </p>
        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>Explore Library</span>
        </div>
      </section>

      <div className="parallax-divider"></div>

      {/* MAIN LIBRARY GRID */}
      <section className="library">
        <header className="library-header reveal">
          <div className="library-header-left">
            <span className="section-label">Curated Collections</span>
            <h2>Inspiration<br/>for Every Vision</h2>
          </div>
          <div className="library-header-right">
            <p>Each collection is crafted to guide you from imagination to blueprint — drawing from global design trends and locally-adapted solutions.</p>
          </div>
        </header>

        <div className="cards-grid">
          {/* Card 1 */}
          <a href="#consultation" className="card" style={{ transitionDelay: '.05s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="card-img-wrap">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives1.jpeg" alt="Modern House Designs" />
              <span className="card-tag">Collection 01</span>
            </div>
            <div className="card-body">
              <p className="card-meta">Trending · 2024/25</p>
              <h3 className="card-title">Top 20 Modern<br/>House Designs</h3>
              <p className="card-desc">
                A curated showcase of the world's most striking contemporary residential architecture — flat rooflines, expansive glazing, and the perfect play of solid and void.
              </p>
              <span className="card-link">
                Read Article <span className="card-link-arrow"></span>
              </span>
            </div>
          </a>

          {/* Card 2 */}
          <a href="#consultation" className="card" style={{ transitionDelay: '.15s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="card-img-wrap">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/4-Bedroom_L-Shaped_Bungalow_Front_Elevation1.jpg" alt="4 Bedroom Plans" />
              <span className="card-tag">Collection 02</span>
            </div>
            <div className="card-body">
              <p className="card-meta">Family Living · Plans</p>
              <h3 className="card-title">Best 4 Bedroom<br/>House Plans</h3>
              <p className="card-desc">
                Space, flow, and family life considered in every sq ft. Discover layouts engineered for how modern families actually live.
              </p>
              <span className="card-link">
                Read Article <span className="card-link-arrow"></span>
              </span>
            </div>
          </a>

          {/* Card 3 */}
          <a href="#consultation" className="card" style={{ transitionDelay: '.25s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="card-img-wrap">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa3.jpg" alt="Luxury Villa" />
              <span className="card-tag">Collection 03</span>
            </div>
            <div className="card-body">
              <p className="card-meta">Premium · 2025 Trends</p>
              <h3 className="card-title">Luxury Villa<br/>Design Trends</h3>
              <p className="card-desc">
                Where architecture meets resort living. Pool pavilions, double-height volumes, and materials that age like wine — the anatomy of a modern villa.
              </p>
              <span className="card-link">
                Read Article <span className="card-link-arrow"></span>
              </span>
            </div>
          </a>

          {/* Card 4 */}
          <a href="#consultation" className="card" style={{ transitionDelay: '.35s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="card-img-wrap">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg" alt="Small Plot" />
              <span className="card-tag">Collection 04</span>
            </div>
            <div className="card-body">
              <p className="card-meta">Smart Living · Urban</p>
              <h3 className="card-title">Small Plot<br/>Design Ideas</h3>
              <p className="card-desc">
                Compact footprint, generous spirit. Discover how clever spatial planning, vertical living, and thoughtful landscaping unlock the full potential of tight urban plots.
              </p>
              <span className="card-link">
                Read Article <span className="card-link-arrow"></span>
              </span>
            </div>
          </a>

        </div>
      </section>

      {/* STATS TICKER */}
      <div className="stats-band">
        <div className="ticker-track" id="ticker">
          <div className="ticker-item"><strong>2,400+</strong> Plans Delivered <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>98%</strong> Client Satisfaction <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>14</strong> Countries Served <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>35yr</strong> Design Excellence <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>500+</strong> Unique Floor Plans <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>12</strong> Design Awards <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>2,400+</strong> Plans Delivered <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>98%</strong> Client Satisfaction <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>14</strong> Countries Served <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>35yr</strong> Design Excellence <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>500+</strong> Unique Floor Plans <span className="ticker-dot"></span></div>
          <div className="ticker-item"><strong>12</strong> Design Awards <span className="ticker-dot"></span></div>
        </div>
      </div>

      {/* FEATURED CTA ROW */}
      <section className="featured-row" id="consultation">
        <div className="featured-inner">
          <div className="featured-text reveal">
            <span className="section-label" style={{ color: 'rgba(200,169,110,.8)' }}>Your Home, Designed</span>
            <h2>Turn Inspiration<br/>into Your <em>Dream</em><br/>Blueprint</h2>
            <p>Every great home in our library started with a single conversation. Our architects translate your ideas, lifestyle, and plot into a fully personalised plan — ready for construction.</p>
            <a className="featured-cta" href="#consultation" onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}><span>Book a Free Consultation →</span></a>
          </div>
          <div className="steps">
            <div className="step" style={{ transitionDelay: '.1s' }}>
              <span className="step-num">01</span>
              <div>
                <p className="step-title">Share Your Vision</p>
                <p className="step-desc">A brief call to understand your lifestyle, preferences, and the plot you're working with.</p>
              </div>
            </div>
            <div className="step" style={{ transitionDelay: '.22s' }}>
              <span className="step-num">02</span>
              <div>
                <p className="step-title">Concept Presentation</p>
                <p className="step-desc">We present 3 tailored design concepts with mood boards, drawn from the latest collections.</p>
              </div>
            </div>
            <div className="step" style={{ transitionDelay: '.34s' }}>
              <span className="step-num">03</span>
              <div>
                <p className="step-title">Full Technical Plans</p>
                <p className="step-desc">Complete architectural drawings, structural plans, and specifications — ready to submit for approval.</p>
              </div>
            </div>
            <div className="step" style={{ transitionDelay: '.46s' }}>
              <span className="step-num">04</span>
              <div>
                <p className="step-title">Build with Confidence</p>
                <p className="step-desc">We remain your partner throughout construction, answering queries and reviewing progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MINI ARTICLES */}
      <section className="mini-articles">
        <header className="mini-header reveal">
          <span className="section-label">Quick Reads</span>
          <h2>More Design Guides</h2>
        </header>
        <div className="mini-grid">

          <a href="#consultation" className="mini-card" style={{ transitionDelay: '.05s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="mini-img">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg" alt="Guide 05" />
            </div>
            <p className="mini-num">Guide 05</p>
            <p className="mini-title">Open-Plan Living: Pros, Cons &amp; Plan Types</p>
            <span className="mini-read"><span className="mini-read-line"></span>Read More</span>
          </a>

          <a href="#consultation" className="mini-card" style={{ transitionDelay: '.15s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="mini-img">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%20Luxury%20English%20Country%20Cottage1.jpg" alt="Guide 06" />
            </div>
            <p className="mini-num">Guide 06</p>
            <p className="mini-title">Bungalow vs Two-Storey: Which Suits Your Plot?</p>
            <span className="mini-read"><span className="mini-read-line"></span>Read More</span>
          </a>

          <a href="#consultation" className="mini-card" style={{ transitionDelay: '.25s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="mini-img">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Townhouse_Community_Architectural_Detail1.jpg" alt="Guide 07" />
            </div>
            <p className="mini-num">Guide 07</p>
            <p className="mini-title">Courtyard Home Design: Light, Air &amp; Privacy</p>
            <span className="mini-read"><span className="mini-read-line"></span>Read More</span>
          </a>

          <a href="#consultation" className="mini-card" style={{ transitionDelay: '.35s' }} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>
            <div className="mini-img">
              <img src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg" alt="Guide 08" />
            </div>
            <p className="mini-num">Guide 08</p>
            <p className="mini-title">Eco-Friendly Home Plans for Sustainable Living</p>
            <span className="mini-read"><span className="mini-read-line"></span>Read More</span>
          </a>

        </div>
      </section>

      <div className="parallax-divider"></div>

      {/* FINAL CTA */}
      <section className="cta-band">
        <h2 className="reveal">Ready to Design<br/>Your <em>Dream</em> Home?</h2>
        <p className="reveal">
          Our architects are ready to transform the inspiration you've found here into a fully personalised blueprint for your plot and lifestyle.
        </p>
        <a className="cta-main" href="#consultation" onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}><span>Book a Free Consultation Today →</span></a>
      </section>

      <footer>
        <span>© 2025 Arctura House Plans. All rights reserved.</span>
        <span>
          <a href="#" onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Privacy</a> &nbsp;·&nbsp;
          <a href="#" onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Terms</a> &nbsp;·&nbsp;
          <a href="#consultation" onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Contact Us</a>
        </span>
      </footer>

    </div>
  );
}
