"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect, useRef } from "react";
import { footerLinks, socialLinks } from "@/lib/dummydata";

const Footer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exploreLinks = [
    { href: "/designs", label: "House Plans" },
    { href: "/categories", label: "Categories" },
    { href: "/design-showcase", label: "Design Showcase" },
    { href: "/ongoing-projects", label: "Projects" },
  ];

  const servicesLinks = [
    { href: "/custom-design", label: "Custom Design" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ];

  const legacyLinks = useMemo(() => {
    const merged = [
      ...footerLinks.about,
      ...footerLinks.legal,
      ...footerLinks.contact,
      { href: "/", label: "Home" },
      { href: "/custom-design", label: "Start a Project" },
    ];

    const seen = new Set<string>();
    return merged.filter((link) => {
      const key = `${link.href}:${link.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    const numPoints = 20;
    type Leaf = { angleOffset: number; scale: number; phase: number };
    type Point = {
      x: number; y: number; ox: number; oy: number;
      mass: number; visualOffsetX: number; visualOffsetY: number;
      leaves: Leaf[];
    };
    const points: Point[] = [];
    let time = 0;
    let currentWind = 0;
    let width = 0;
    let targetDist = 0;
    const VINE_HEIGHT = 120;

    function init() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      canvas.height = VINE_HEIGHT;
      targetDist = (width / numPoints) * 1.05;
      points.length = 0;

      for (let i = 0; i <= numPoints; i++) {
        const progress = i / numPoints;
        const drop = Math.sin(progress * Math.PI) * 45;
        const leaves: Leaf[] = [];

        if (i > 0 && i < numPoints) {
          const numLeaves = Math.floor(Math.random() * 2) + 1;
          for (let j = 0; j < numLeaves; j++) {
            leaves.push({
              angleOffset: (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 6 + Math.random() * Math.PI / 4),
              scale: 0.5 + Math.random() * 0.6,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }

        points.push({
          x: i * (width / numPoints),
          y: 6 + drop,
          ox: i * (width / numPoints),
          oy: 6 + drop,
          mass: 1 + Math.random() * 0.5,
          visualOffsetX: (Math.random() - 0.5) * 10,
          visualOffsetY: (Math.random() - 0.5) * 8,
          leaves,
        });
      }
    }

    function update() {
      time += 0.04;
      const windBase = Math.sin(time * 0.5) * 0.25;
      const windGust = Math.max(0, Math.sin(time * 1.2)) * Math.sin(time * 2.5) * 1.8;
      currentWind = windBase + windGust;
      const gravity = 0.25;

      for (let i = 1; i < numPoints; i++) {
        const p = points[i];
        const vx = (p.x - p.ox) * 0.96;
        const vy = (p.y - p.oy) * 0.96;
        p.ox = p.x;
        p.oy = p.y;
        p.y += gravity * p.mass;
        p.x += currentWind / p.mass;
        p.y -= Math.abs(currentWind) * 0.08 / p.mass;
        p.x += vx;
        p.y += vy;
      }

      const iterations = 15;
      for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < numPoints; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = targetDist - dist;
          const percent = (diff / dist) * 0.5;
          const offsetX = dx * percent;
          const offsetY = dy * percent;
          if (i !== 0) { p1.x -= offsetX; p1.y -= offsetY; }
          if (i + 1 !== numPoints) { p2.x += offsetX; p2.y += offsetY; }
        }
      }

      // Lock endpoints at top edge
      points[0].x = 0;
      points[0].y = 5;
      points[numPoints].x = width;
      points[numPoints].y = 5;
    }

    function drawLeaf(x: number, y: number, angle: number, scale: number, phase: number) {
      ctx.save();
      ctx.translate(x, y);
      const flutter = Math.sin(time * 4 + phase) * 0.18 * (Math.abs(currentWind) + 0.2);
      ctx.rotate(angle + flutter);
      ctx.scale(scale, scale);

      // Gold-toned leaf
      const gradient = ctx.createLinearGradient(0, 0, 28, 0);
      gradient.addColorStop(0, "#6b4f25");
      gradient.addColorStop(1, "#C9A96E");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(12, -12, 28, 0);
      ctx.quadraticCurveTo(12, 12, 0, 0);
      ctx.fill();

      // Vein
      ctx.strokeStyle = "rgba(184,147,90,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(12, -1.5, 24, 0);
      ctx.stroke();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, width, VINE_HEIGHT);

      // Outer stem
      ctx.beginPath();
      ctx.moveTo(points[0].x + points[0].visualOffsetX, points[0].y + points[0].visualOffsetY);
      for (let i = 1; i <= numPoints; i++) {
        ctx.lineTo(points[i].x + points[i].visualOffsetX, points[i].y + points[i].visualOffsetY);
      }
      ctx.strokeStyle = "#3d2a14";
      ctx.lineWidth = 4;
      ctx.lineJoin = "bevel";
      ctx.stroke();

      // Inner highlight
      ctx.beginPath();
      ctx.moveTo(points[0].x + points[0].visualOffsetX, points[0].y + points[0].visualOffsetY - 1);
      for (let i = 1; i <= numPoints; i++) {
        ctx.lineTo(points[i].x + points[i].visualOffsetX, points[i].y + points[i].visualOffsetY - 1);
      }
      ctx.strokeStyle = "#7a5c30";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Twigs & leaves
      for (let i = 1; i < numPoints; i++) {
        const p = points[i];
        const prev = points[i - 1];
        const px = p.x + p.visualOffsetX;
        const py = p.y + p.visualOffsetY;
        const prevX = prev.x + prev.visualOffsetX;
        const prevY = prev.y + prev.visualOffsetY;
        const baseAngle = Math.atan2(py - prevY, px - prevX);

        p.leaves.forEach((leaf) => {
          const leafAngle = baseAngle + leaf.angleOffset;
          const twigLength = 9 * leaf.scale;
          const twigX = px + Math.cos(leafAngle) * twigLength;
          const twigY = py + Math.sin(leafAngle) * twigLength;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(twigX, twigY);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#5a3e1f";
          ctx.stroke();

          drawLeaf(twigX, twigY, leafAngle, leaf.scale, leaf.phase);
        });
      }
    }

    function animate() {
      update();
      draw();
      animFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);
    init();
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <footer
      className="relative border-t border-cb-border px-6 pb-10 pt-16 lg:px-[60px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://conceptbuilders.sfo3.cdn.digitaloceanspaces.com/designimages/modern_3-bedroombungalow9.jpg')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0A0A08]/90" />

      {/* Swinging vine canvas draped across the top of the footer */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "120px", zIndex: 5 }}
      />

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
        <div className="mb-14 grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-12 max-[1000px]:grid-cols-2 max-[1000px]:gap-8 max-[560px]:grid-cols-1">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/images/concept-builders-logo-free-bg.webp"
                alt="Concept Builders logo"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
                priority
              />
              <span
                className="text-[28px] font-light text-cream"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Concept Builders
              </span>
            </div>
            <p className="mb-7 max-w-[460px] text-[13px] leading-[1.8] text-cb-muted">
              Your trusted partner in architectural design across Kenya. We turn
              blueprints into homes and homes into legacies.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-cream transition-colors hover:text-gold"
            >
              Contact Us
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1.5"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              Explore
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              Services
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              {servicesLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">
              More Links
            </p>
            <ul className="space-y-2.5 text-[13px] text-cb-muted">
              {legacyLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-cb-border pt-8 max-[900px]:flex-col max-[900px]:gap-5">
          <p className="text-[12px] tracking-[0.06em] text-cb-muted">
            © {new Date().getFullYear()} Concept Builders Kenya. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="rounded-md p-2 text-cb-muted transition-all duration-300 hover:bg-surface hover:text-gold"
                aria-label={`Social link ${index + 1}`}
                target="_blank"
                rel="noreferrer"
              >
                <link.icon className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 sm:h-7 sm:w-7" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
