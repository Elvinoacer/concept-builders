"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './SocialProof.css';

export default function SocialProof() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const statsObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Cursor glow
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 140}px, ${e.clientY - 140}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Card reveal
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const delay = parseInt(target.dataset.delay || '0');
          setTimeout(() => target.classList.add('visible'), delay);
          if (observerRef.current) {
            observerRef.current.unobserve(target);
          }
        }
      });
    }, { threshold: 0.12 });

    const cards = document.querySelectorAll('.sp-wrapper .card');
    cards.forEach(c => observerRef.current?.observe(c));

    // Heading reveal
    const reveals = document.querySelectorAll('.sp-wrapper .sp-reveal');
    reveals.forEach(el => {
      observerRef.current?.observe(el);
    });

    // Stats count up
    statsObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const targetNum = parseInt(el.dataset.target || '0');
          const duration = 1600;
          const step = targetNum / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= targetNum) { 
              current = targetNum; 
              clearInterval(timer); 
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, 16);
          if (statsObserverRef.current) {
            statsObserverRef.current.unobserve(el);
          }
        }
      });
    }, { threshold: 0.5 });

    const counters = document.querySelectorAll('.sp-wrapper .count-up');
    counters.forEach(c => statsObserverRef.current?.observe(c));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (observerRef.current) observerRef.current.disconnect();
      if (statsObserverRef.current) statsObserverRef.current.disconnect();
    };
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.transform = '';
  };

  const StarIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );

  const Stars = () => (
    <div className="card__stars">
      <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
    </div>
  );

  return (
    <div className="sp-wrapper">
      <div className="cursor-glow" ref={cursorRef}></div>
      <section className="social-section" id="testimonials">
        {/* Heading */}
        <div className="section-head sp-reveal">
          <p className="eyebrow"><span></span> Client Stories <span></span></p>
          <h2 className="section-title">The Best Proof Is a Family Living in a Home They Love</h2>
          <p className="section-sub">Every project starts as a conversation and ends as a place people proudly call home.</p>
        </div>

        {/* Cards */}
        <div className="testimonials-grid" id="grid">

          {/* ── FEATURED CARD ── */}
          <article className="card card--featured" data-delay="0" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            <div className="card__img-wrap">
              <img
                src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg"
                alt="Modern family home by the Kamau family"
                loading="lazy"
              />
              <span className="card__badge">Modern Family</span>
              <Stars />
            </div>
            <div className="card__body">
              <span className="card__quote-mark">"</span>
              <p className="card__text">We handed BluePrint &amp; Co a rough sketch on a napkin and they handed us back the home we'd been dreaming about for fifteen years. The level of detail in the plan—every window orientation, every storage nook—was extraordinary. Our builder said it was the most thorough set of drawings he'd ever worked from.</p>
              <div className="card__divider"></div>
              <div className="card__client">
                <div className="card__avatar">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Amelia Kamau" />
                </div>
                <div className="card__client-info">
                  <p className="card__name">Amelia Kamau</p>
                  <p className="card__meta">4-Bedroom Modern · Runda, Nairobi</p>
                </div>
              </div>
            </div>
          </article>

          {/* ── CARD 2 ── */}
          <article className="card" data-delay="120" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            <div className="card__img-wrap">
              <img
                src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%20Luxury%20English%20Country%20Cottage1.jpg"
                alt="Cottage-style home"
                loading="lazy"
              />
              <span className="card__badge">Cottage Style</span>
              <Stars />
            </div>
            <div className="card__body">
              <span className="card__quote-mark">"</span>
              <p className="card__text">I was worried a standard plan couldn't capture the warmth I wanted. Three weeks after delivery, I had a home full of light and character. Worth every shilling.</p>
              <div className="card__divider"></div>
              <div className="card__client">
                <div className="card__avatar">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="James Odhiambo" />
                </div>
                <div className="card__client-info">
                  <p className="card__name">James Odhiambo</p>
                  <p className="card__meta">3-Bed Cottage · Eldoret</p>
                </div>
              </div>
            </div>
          </article>

          {/* ── CARD 3 ── */}
          <article className="card" data-delay="240" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            <div className="card__img-wrap">
              <img
                src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa2.jpg"
                alt="Luxury villa"
                loading="lazy"
              />
              <span className="card__badge">Luxury Villa</span>
              <Stars />
            </div>
            <div className="card__body">
              <span className="card__quote-mark">"</span>
              <p className="card__text">Our villa looks like it belongs on the cover of a design magazine. The spatial flow is flawless—something you can only get from an architect who truly listens.</p>
              <div className="card__divider"></div>
              <div className="card__client">
                <div className="card__avatar">
                  <img src="https://randomuser.me/api/portraits/women/67.jpg" alt="Wanjiku Muthoni" />
                </div>
                <div className="card__client-info">
                  <p className="card__name">Wanjiku Muthoni</p>
                  <p className="card__meta">5-Bed Villa · Karen, Nairobi</p>
                </div>
              </div>
            </div>
          </article>

          {/* ── CARD 4 ── */}
          <article className="card" data-delay="360" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            <div className="card__img-wrap">
              <img
                src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg"
                alt="Bungalow design"
                loading="lazy"
              />
              <span className="card__badge">Contemporary Bungalow</span>
              <Stars />
            </div>
            <div className="card__body">
              <span className="card__quote-mark">"</span>
              <p className="card__text">Single storey, big dreams. They fit a home office, guest wing, and open kitchen into our modest plot without it ever feeling cramped. Pure genius.</p>
              <div className="card__divider"></div>
              <div className="card__client">
                <div className="card__avatar">
                  <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="Brian Otieno" />
                </div>
                <div className="card__client-info">
                  <p className="card__name">Brian Otieno</p>
                  <p className="card__meta">3-Bed Bungalow · Kisumu</p>
                </div>
              </div>
            </div>
          </article>

          {/* ── CARD 5 ── */}
          <article className="card" data-delay="480" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            <div className="card__img-wrap">
              <img
                src="https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Townhouse_Community_Streetscape1.jpg"
                alt="Townhouse design"
                loading="lazy"
              />
              <span className="card__badge">Townhouse</span>
              <Stars />
            </div>
            <div className="card__body">
              <span className="card__quote-mark">"</span>
              <p className="card__text">Bought plans on a Thursday, submitted to the county on Monday. The documentation package was so complete we sailed through approvals in under six weeks.</p>
              <div className="card__divider"></div>
              <div className="card__client">
                <div className="card__avatar">
                  <img src="https://randomuser.me/api/portraits/women/29.jpg" alt="Fatuma Hassan" />
                </div>
                <div className="card__client-info">
                  <p className="card__name">Fatuma Hassan</p>
                  <p className="card__meta">Duplex Townhouse · Mombasa</p>
                </div>
              </div>
            </div>
          </article>

        </div>

        {/* Stats Strip */}
        <div className="stats-strip">
          <div className="stat">
            <span className="stat__num"><span className="count-up" data-target="22">0</span>+</span>
            <span className="stat__label">Years Designing Homes Across Kenya</span>
          </div>
          <div className="stat">
            <span className="stat__num"><span className="count-up" data-target="1000">0</span>+</span>
            <span className="stat__label">House Plans Delivered</span>
          </div>
          <div className="stat">
            <span className="stat__num"><span className="count-up" data-target="500">0</span>+</span>
            <span className="stat__label">Successful Residential Projects</span>
          </div>
          <div className="stat">
            <span className="stat__num">Thousands</span>
            <span className="stat__label">Family Members Living in Homes We Helped Design</span>
          </div>
        </div>

        {/* CTA Row */}
        <div className="sp-cta-row">
          <Link href="/ongoing-projects" className="sp-btn-ghost">
            View Our Work
          </Link>
          <Link href="/designs" className="sp-btn-primary">
            Browse All Plans →
          </Link>
        </div>

      </section>
    </div>
  );
}
