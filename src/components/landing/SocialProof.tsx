"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './SocialProof.css';

export type SocialProofProject = {
  id: string;
  title: string;
  description: string | null;
  featuredImage: string | null;
  clientName: string | null;
  location: string | null;
  status: string;
  category: string;
};

export default function SocialProof({ projects = [] }: { projects?: SocialProofProject[] }) {
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
  }, [projects]);

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

  // Hardcoded projects if none passed to match original design structure
  const displayProjects = projects.length > 0 ? projects : [];

  return (
    <div className="sp-wrapper">
      <div className="cursor-glow" ref={cursorRef}></div>
      <section className="social-section" id="testimonials">
        {/* Heading */}
        <div className="section-head sp-reveal">
          <p className="eyebrow"><span></span> Work Proof <span></span></p>
          <h2 className="section-title">The Best Proof Is Our Ongoing Projects</h2>
          <p className="section-sub">Every project starts as a conversation and ends as a place people proudly call home.</p>
        </div>

        {/* Cards */}
        <div className="testimonials-grid" id="grid">
          {displayProjects.map((project, index) => (
            <article 
              key={project.id}
              className={`card ${index === 0 ? 'card--featured' : ''}`} 
              data-delay={index * 120} 
              onMouseMove={handleCardMouseMove} 
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="card__img-wrap">
                <Image
                  src={project.featuredImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"}
                  alt={project.title}
                  fill sizes="(max-width: 768px) 100vw, 350px" style={{ objectFit: "cover" }}
                />
                <span className="card__badge">{project.status === "IN_PROGRESS" ? "In Progress" : project.status.replace(/_/g, " ")}</span>
              </div>
              <div className="card__body">
                <p className="card__text">{project.description || "A wonderful ongoing project by Concept Builders."}</p>
                <div className="card__divider"></div>
                <div className="card__client">
                  <div className="card__client-info">
                    <p className="card__name">{project.title}</p>
                    <p className="card__meta">{project.clientName ? `${project.clientName} · ` : ''}{project.location || 'Kenya'}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
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
