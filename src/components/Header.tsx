"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PublicThemeToggle from "@/components/ui/public-theme-toggle";

// ─── Vine Canvas — ported from living_vine_wind.html, recolored in gold ──────
function VineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let windStrength = 0;
    let windTarget = 0;

    let W = 0;
    let H = 0;

    // Node & leaf types
    type Node  = { baseX: number; baseY: number; x: number; y: number };
    type Leaf  = {
      nodeIdx: number; offsetX: number; offsetY: number;
      stemLen: number; stemAngle: number;
      leafSize: number; leafRatio: number; leafAngle: number;
      phase: number; phaseSpeed: number;
      dark: string; light: string; side: number; wiltFactor: number;
    };
    type Tendril = { nodeIdx: number; side: number; length: number; phase: number; coils: number };

    let NODES: Node[]    = [];
    let LEAVES: Leaf[]   = [];
    let TENDRILS: Tendril[] = [];
    const NUM_NODES = 16;

    // Gold / amber leaf palette  (mirrors the green pairs in the original)
    const leafColors: [string, string][] = [
      ["#6b4f20", "#C9A96E"],
      ["#7a5c28", "#d4b47e"],
      ["#5a3e18", "#b8935a"],
      ["#8B6F3E", "#e0c080"],
      ["#704a1e", "#c8a060"],
    ];

    function build() {
      // Exactly as in living_vine_wind.html
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;

      const STEM_Y   = 40; // Position the stem inside the header
      const STEM_START = W * 0.03;
      const STEM_END   = W * 0.97;

      NODES = [];
      for (let i = 0; i <= NUM_NODES; i++) {
        const t = i / NUM_NODES;
        NODES.push({
          baseX: STEM_START + t * (STEM_END - STEM_START),
          baseY: STEM_Y,
          x: 0, y: 0,
        });
      }

      LEAVES = [];
      for (let i = 0; i < NUM_NODES; i++) {
        const numLeaves = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < numLeaves; j++) {
          const side = (i + j) % 2 === 0 ? -1 : 1;
          const [dark, light] = leafColors[Math.floor(Math.random() * leafColors.length)];
          LEAVES.push({
            nodeIdx: i,
            offsetX:    (Math.random() - 0.5) * 20,
            offsetY:    (Math.random() - 0.5) * 12,
            stemLen:    35 + Math.random() * 40,
            stemAngle:  side * (Math.PI * 0.3  + Math.random() * 0.5),
            leafSize:   22 + Math.random() * 28,
            leafRatio:  0.55 + Math.random() * 0.3,
            leafAngle:  side * (Math.PI * 0.1  + Math.random() * 0.3),
            phase:      Math.random() * Math.PI * 2,
            phaseSpeed: 0.6  + Math.random() * 0.8,
            dark, light,
            side,
            wiltFactor: 0.6 + Math.random() * 0.4,
          });
        }
      }

      TENDRILS = [];
      for (let i = 1; i < NUM_NODES - 1; i += 3) {
        const side = i % 2 === 0 ? 1 : -1;
        TENDRILS.push({
          nodeIdx: i, side,
          length: 50 + Math.random() * 60,
          phase:  Math.random() * Math.PI * 2,
          coils:  2.5 + Math.random() * 2,
        });
      }
    }

    function noise(x: number, t: number, freq: number, amp: number) {
      return Math.sin(x * freq + t) * amp + Math.sin(x * freq * 1.7 + t * 1.3) * amp * 0.5;
    }

    function updateWind() {
      if (Math.random() < 0.005) windTarget = (Math.random() - 0.3) * 3.5;
      if (Math.random() < 0.002) windTarget = 0;
      windStrength += (windTarget - windStrength) * 0.015;
    }

    function updateNodes() {
      const STEM_Y = 40; // Keep stem in the header
      for (let i = 0; i <= NUM_NODES; i++) {
        const t = i / NUM_NODES;
        const n = NODES[i];
        const wave = noise(t, time * 0.8, 2.5, 1) * windStrength * 4;
        const sag  = Math.sin(t * Math.PI) * 18 + noise(t, time * 0.4, 1.5, 3);
        n.x = n.baseX + wave * 6;
        n.y = STEM_Y  + sag  + wave * 2;
      }
    }

    function drawStem() {
      ctx.save();
      ctx.lineCap  = "round";
      ctx.lineJoin = "round";

      // Main stem — dark gold/bronze outer
      ctx.beginPath();
      ctx.moveTo(NODES[0].x, NODES[0].y);
      for (let i = 1; i <= NUM_NODES; i++) {
        const prev = NODES[i - 1];
        const curr = NODES[i];
        ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
      }
      const stemGrad = ctx.createLinearGradient(0, 40 - 6, 0, 40 + 6);
      stemGrad.addColorStop(0,    "#3d2808");
      stemGrad.addColorStop(0.35, "#5a3e18");
      stemGrad.addColorStop(0.65, "#6b5228");
      stemGrad.addColorStop(1,    "#2e1e06");
      ctx.strokeStyle = stemGrad;
      ctx.lineWidth   = 9;
      ctx.stroke();

      // Highlight
      ctx.beginPath();
      ctx.moveTo(NODES[0].x, NODES[0].y - 2);
      for (let i = 1; i <= NUM_NODES; i++) {
        const prev = NODES[i - 1];
        const curr = NODES[i];
        ctx.quadraticCurveTo(prev.x, prev.y - 2, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2 - 2);
      }
      ctx.strokeStyle = "rgba(180,130,60,0.3)";
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      ctx.restore();
    }

    function drawLeafShape(size: number, ratio: number, color1: string, color2: string, wilt: number) {
      const hw = size * ratio;
      const hh = size;

      const grad = ctx.createRadialGradient(0, -hh * 0.2, 0, 0, 0, size);
      grad.addColorStop(0, color2);
      grad.addColorStop(1, color1);

      ctx.beginPath();
      ctx.moveTo(0, -hh);
      ctx.bezierCurveTo( hw * 0.9, -hh * 0.5,  hw * (1 + wilt * 0.1), hh * 0.1, 0, hh * 0.3);
      ctx.bezierCurveTo(-hw * (1 + wilt * 0.1), hh * 0.1, -hw * 0.9, -hh * 0.5, 0, -hh);
      ctx.fillStyle = grad;
      ctx.fill();

      // Midrib
      ctx.beginPath();
      ctx.moveTo(0, -hh);
      ctx.quadraticCurveTo(0, 0, 0, hh * 0.3);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Veins
      for (let i = 0; i < 3; i++) {
        const vt = (i + 1) / 4;
        const vy = -hh + vt * (hh * 1.3);
        const vx =  hw * 0.7 * (1 - vt);
        ctx.beginPath(); ctx.moveTo(0, vy);
        ctx.quadraticCurveTo( vx * 0.5, vy - hh * 0.08,  vx, vy + hh * 0.1);
        ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, vy);
        ctx.quadraticCurveTo(-vx * 0.5, vy - hh * 0.08, -vx, vy + hh * 0.1);
        ctx.stroke();
      }
    }

    function drawLeaves() {
      for (const leaf of LEAVES) {
        const node = NODES[leaf.nodeIdx];
        const lx = node.x + leaf.offsetX;
        const ly = node.y + leaf.offsetY;

        const windSway  = windStrength * 0.18 * leaf.wiltFactor;
        const swayAngle = Math.sin(time * leaf.phaseSpeed + leaf.phase) * 0.12 + windSway;
        const stemAngle = leaf.stemAngle + swayAngle;

        const sx = lx + Math.cos(stemAngle - Math.PI / 2) * leaf.stemLen;
        const sy = ly + Math.sin(stemAngle - Math.PI / 2) * leaf.stemLen;

        // Leaf stem
        ctx.save();
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(sx, sy);
        ctx.strokeStyle = "#7a5c20"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();

        // Leaf blade
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(stemAngle + leaf.leafAngle + swayAngle * 0.6);
        drawLeafShape(leaf.leafSize, leaf.leafRatio, leaf.dark, leaf.light, windStrength * 0.04);
        ctx.restore();
      }
    }

    function drawTendrils() {
      for (const t of TENDRILS) {
        const node = NODES[t.nodeIdx];
        const windPush = windStrength * 0.08 * t.side;
        const wobble   = Math.sin(time * 0.7 + t.phase) * 0.25 + windPush;

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.strokeStyle  = "#9a7a30";
        ctx.lineWidth    = 1;
        ctx.globalAlpha  = 0.7;
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= 40; i++) {
          const tt     = i / 40;
          const angle  = tt * t.coils * Math.PI * 2 + wobble;
          const radius = tt * t.length / (t.coils * Math.PI * 2) * 4;
          const tx = Math.cos(angle) * radius * t.side;
          const ty = Math.sin(angle) * radius + t.length * tt * 0.5;
          if (first) { ctx.moveTo(tx, ty); first = false; } else ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    function loop() {
      time += 0.016;
      updateWind();
      updateNodes();
      ctx.clearRect(0, 0, W, H);

      // Soft vine shadow (no background drawn — header bg shows through)
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.filter = "blur(6px)";
      ctx.beginPath();
      ctx.moveTo(NODES[0].x, NODES[0].y + 10);
      for (let i = 1; i <= NUM_NODES; i++) {
        ctx.quadraticCurveTo(
          NODES[i-1].x, NODES[i-1].y + 14,
          (NODES[i-1].x + NODES[i].x) / 2,
          (NODES[i-1].y + NODES[i].y) / 2 + 12
        );
      }
      ctx.strokeStyle = "#3d2800"; ctx.lineWidth = 12; ctx.stroke();
      ctx.filter = "none";
      ctx.restore();

      drawStem();
      drawTendrils();
      drawLeaves();

      animId = requestAnimationFrame(loop);
    }

    const onResize = () => { build(); };
    window.addEventListener("resize", onResize);
    build();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute top-0 left-0"
      style={{ zIndex: 0, opacity: 0.2 }}
      aria-hidden="true"
    />
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const primaryLinks = [
    { href: "/designs",           label: "Plans"      },
    { href: "/categories",        label: "Categories" },
    { href: "/design-showcase",   label: "Showcase"   },
    { href: "/ongoing-projects",  label: "Projects"   },
  ];

  const mobileLinks = [
    ...primaryLinks,
    { href: "/custom-design", label: "Custom Design" },
    { href: "/contact",       label: "Contact"       },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? "border-cb-border bg-[rgba(10,9,7,0.92)] backdrop-blur-[20px]"
            : "border-cb-border bg-card"
        }`}
      >
        {/* Vine fills the entire header as a living background */}
        <VineCanvas />

        {/* All nav content sits on top with z-10 */}
        <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl items-center justify-between px-5 py-4 sm:px-6 lg:px-[60px]">
          <Link
            href="/"
            className="flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            <span className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
              <Image
                src="/images/concept-builders-logo-free-bg.webp"
                alt="Concept Builders logo"
                fill
                priority
                sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 56px"
                className="object-contain"
              />
            </span>
            <span className="text-[20px] font-medium tracking-[0.06em] text-cream sm:text-[22px]">
              Concept Builders
            </span>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.12em] text-cream-dim transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/custom-design"
              className="border border-gold px-6 py-2.5 text-[12px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Start a Project
            </Link>
          </nav>

          <div className="hidden lg:block">
            <PublicThemeToggle className="h-9 w-9" />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <PublicThemeToggle className="h-9 w-9" />
            <button
              className="relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className={`block h-[1.5px] w-6 bg-cream transition-all duration-300 ${mobileMenuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
              <span className={`block h-[1.5px] w-6 bg-cream transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[1.5px] w-6 bg-cream transition-all duration-300 ${mobileMenuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[49] bg-ink/95 backdrop-blur-md transition-all duration-500 lg:pointer-events-none lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
          {mobileLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-center text-[28px] font-light tracking-[0.08em] text-cream transition-all duration-500 hover:text-gold ${
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${150 + i * 60}ms` : "0ms",
                fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/custom-design"
            onClick={() => setMobileMenuOpen(false)}
            className={`mt-4 border border-gold px-8 py-3 text-[13px] uppercase tracking-[0.16em] text-gold transition-all duration-500 hover:bg-gold hover:text-ink ${
              mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: mobileMenuOpen ? "510ms" : "0ms" }}
          >
            Start a Project
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
