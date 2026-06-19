"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "./DesignIdeas.css";

export default function DesignIdeas({ collections }: { collections: any[] }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouse.current.x + "px";
        dotRef.current.style.top = mouse.current.y + "px";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    const animateCursor = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top = ringPos.current.y + "px";
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const handleScroll = () => {
      if (progressBarRef.current) {
        const scrolled = window.scrollY;
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        progressBarRef.current.style.width = (scrolled / total) * 100 + "%";
      }
    };
    window.addEventListener("scroll", handleScroll);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            if (observerRef.current) {
              observerRef.current.unobserve(e.target);
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    const revealElements = document.querySelectorAll(
      ".di-wrapper .card, .di-wrapper .step, .di-wrapper .mini-card, .di-wrapper .reveal",
    );
    revealElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleLinkEnter = () => {
    document.querySelector(".di-wrapper")?.classList.add("link-hovered");
  };

  const handleLinkLeave = () => {
    document.querySelector(".di-wrapper")?.classList.remove("link-hovered");
  };

  return (
    <div className="di-wrapper" id="design-ideas">
      {/* Custom cursor */}
      <div id="cursor-dot" className="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" className="cursor-ring" ref={ringRef}></div>

      {/* Progress reading indicator */}
      <div
        ref={progressBarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          width: "0%",
          background: "linear-gradient(to right, #b8935a, #c8a96e)",
          zIndex: 1000,
          transition: "width .1s linear",
          pointerEvents: "none",
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
        <h1>
          Not Sure What
          <br />
          <em>You Want Yet?</em>
        </h1>
        <p className="hero-sub">
          Browse real projects, compare layouts, and discover ideas that match
          your lifestyle before making a decision.
        </p>
        <Link
          href="/designs"
          className="hero-scroll"
          style={{ textDecoration: "none" }}
        >
          <div className="scroll-line"></div>
          <span>Explore Library</span>
        </Link>
      </section>

      <div className="parallax-divider"></div>

      {/* MAIN LIBRARY GRID */}
      <section className="library">
        <header className="library-header reveal">
          <div className="library-header-left">
            <span className="section-label">Curated Collections</span>
            <h2>
              Inspiration
              <br />
              for Every Vision
            </h2>
          </div>
          <div className="library-header-right">
            <p>
              Each collection is crafted to guide you from imagination to
              blueprint — drawing from global design trends and locally-adapted
              solutions.
            </p>
          </div>
        </header>

        <div className="cards-grid">
          {collections.map((item, index) => (
            <Link
              key={item.id}
              href={
                item.category
                  ? `/designs?category=${item.category.name}`
                  : "/designs"
              }
              className="card"
              style={{ transitionDelay: `${index * 0.1 + 0.05}s` }}
              onMouseEnter={handleLinkEnter}
              onMouseLeave={handleLinkLeave}
            >
              <div className="card-img-wrap">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                <span className="card-tag">
                  Collection {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="card-body">
                <p className="card-meta">{item.subtitle}</p>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
                <span className="card-link">
                  View Designs <span className="card-link-arrow"></span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="stats-band">
        <div className="ticker-track" id="ticker">
          <div className="ticker-item">
            <strong>1,500+</strong> Design Plans{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>98%</strong> Client Satisfaction{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>14</strong> Countries Served{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>20</strong> Years Experience{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>12</strong> Design Awards{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>1,500+</strong> Design Plans{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>98%</strong> Client Satisfaction{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>14</strong> Countries Served{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>20</strong> Years Experience{" "}
            <span className="ticker-dot"></span>
          </div>
          <div className="ticker-item">
            <strong>12</strong> Design Awards{" "}
            <span className="ticker-dot"></span>
          </div>
        </div>
      </div>

      {/* FEATURED CTA ROW */}
      <section className="featured-row" id="consultation">
        <div className="featured-inner">
          <div className="featured-text reveal">
            <span
              className="section-label"
              style={{ color: "rgba(200,169,110,.8)" }}
            >
              Why Choose Us
            </span>
            <h2>
              Why Homeowners
              <br />
              Trust <em>Concept Builders</em>
            </h2>
            <p>
              Every great home starts with a solid foundation of trust. We bring
              expertise, transparency, and a commitment to quality that ensures
              your project is a success from start to finish.
            </p>
            <Link
              className="featured-cta"
              href="#consultation-form"
              onMouseEnter={handleLinkEnter}
              onMouseLeave={handleLinkLeave}
            >
              <span>Book a Free Consultation →</span>
            </Link>
          </div>
          <div className="steps">
            <div className="step" style={{ transitionDelay: ".1s" }}>
              <div>
                <p className="step-title">We Design for Real Kenyan Plots</p>
                <p className="step-desc">
                  Whether you own a 40×80, 50×100, or larger parcel, we create
                  designs that maximize your space.
                </p>
              </div>
            </div>
            <div className="step" style={{ transitionDelay: ".22s" }}>
              <div>
                <p className="step-title">
                  We Help You Avoid Expensive Mistakes
                </p>
                <p className="step-desc">
                  Design issues discovered during construction are costly. We
                  solve them before building begins.
                </p>
              </div>
            </div>
            <div className="step" style={{ transitionDelay: ".34s" }}>
              <div>
                <p className="step-title">Customisation Comes Standard</p>
                <p className="step-desc">
                  Need more bedrooms, a larger kitchen, a home office, or future
                  expansion space? We tailor plans around your needs.
                </p>
              </div>
            </div>
            <div className="step" style={{ transitionDelay: ".46s" }}>
              <div>
                <p className="step-title">Support Beyond Drawings</p>
                <p className="step-desc">
                  We guide you through approvals, planning, and construction
                  considerations.
                </p>
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
          <Link
            href="/blog"
            className="mini-card"
            style={{ transitionDelay: ".05s" }}
            onMouseEnter={handleLinkEnter}
            onMouseLeave={handleLinkLeave}
          >
            <div className="mini-img">
              <Image
                src="https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg"
                alt="Guide 05"
                fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: "cover" }}
              />
            </div>
            <p className="mini-num">Guide 05</p>
            <p className="mini-title">
              Open-Plan Living: Pros, Cons &amp; Plan Types
            </p>
            <span className="mini-read">
              <span className="mini-read-line"></span>Read More
            </span>
          </Link>

          <Link
            href="/blog"
            className="mini-card"
            style={{ transitionDelay: ".15s" }}
            onMouseEnter={handleLinkEnter}
            onMouseLeave={handleLinkLeave}
          >
            <div className="mini-img">
              <Image
                src="https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage1.jpg"
                alt="Guide 06"
                fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: "cover" }}
              />
            </div>
            <p className="mini-num">Guide 06</p>
            <p className="mini-title">
              Bungalow vs Two-Storey: Which Suits Your Plot?
            </p>
            <span className="mini-read">
              <span className="mini-read-line"></span>Read More
            </span>
          </Link>

          <Link
            href="/blog"
            className="mini-card"
            style={{ transitionDelay: ".25s" }}
            onMouseEnter={handleLinkEnter}
            onMouseLeave={handleLinkLeave}
          >
            <div className="mini-img">
              <Image
                src="https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Architectural_Detail1.jpg"
                alt="Guide 07"
                fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: "cover" }}
              />
            </div>
            <p className="mini-num">Guide 07</p>
            <p className="mini-title">
              Courtyard Home Design: Light, Air &amp; Privacy
            </p>
            <span className="mini-read">
              <span className="mini-read-line"></span>Read More
            </span>
          </Link>

          <Link
            href="/blog"
            className="mini-card"
            style={{ transitionDelay: ".35s" }}
            onMouseEnter={handleLinkEnter}
            onMouseLeave={handleLinkLeave}
          >
            <div className="mini-img">
              <Image
                src="https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg"
                alt="Guide 08"
                fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: "cover" }}
              />
            </div>
            <p className="mini-num">Guide 08</p>
            <p className="mini-title">
              Eco-Friendly Home Plans for Sustainable Living
            </p>
            <span className="mini-read">
              <span className="mini-read-line"></span>Read More
            </span>
          </Link>
        </div>
      </section>

      <div className="parallax-divider"></div>

      {/* FINAL CTA */}
      <section className="cta-band">
        <h2 className="reveal">
          Building Starts Long
          <br />
          Before <em>Construction</em> Begins.
        </h2>
        <p className="reveal">
          The right design can save money, reduce stress, and prevent costly
          changes later. Talk to us before you break ground.
        </p>
        <Link
          className="cta-main"
          href="#consultation-form"
          onMouseEnter={handleLinkEnter}
          onMouseLeave={handleLinkLeave}
        >
          <span>Schedule a Consultation →</span>
        </Link>
      </section>
    </div>
  );
}
