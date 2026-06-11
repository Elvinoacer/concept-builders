"use client";
import { motion } from "framer-motion";
import FeaturedDesigns from "@/components/design-showcase/FeaturedDesigns";
import ExploreDesigns from "@/components/design-showcase/ExploreDesigns";
import DesignPreviewModal from "@/components/design-showcase/DesignPreviewModal";
import Link from "next/link";
import { useState } from "react";

const DesignShowcasePage = () => {
  const [previewId, setPreviewId] = useState<string | null>(null);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen w-full overflow-hidden bg-ink text-cream"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "url('/images/banners/banner2.webp')", backgroundSize: "cover", backgroundPosition: "center top", opacity: 0.08 }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 8% 12%, rgba(200,137,42,0.12) 0%, transparent 36%), radial-gradient(circle at 86% 22%, rgba(200,137,42,0.09) 0%, transparent 32%), linear-gradient(140deg, rgba(17,16,9,0.95) 0%, rgba(10,9,7,1) 58%)",
          }}
        />
        <div
          className="absolute inset-0 bg-[size:72px_72px]"
          style={{
            backgroundImage:
              "linear-gradient(var(--landing-hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--landing-hero-grid-line) 1px, transparent 1px)",
            maskImage: "var(--landing-hero-grid-mask)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-screen-2xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-[60px] lg:pb-24 lg:pt-20">
        <section className="mb-10 border border-cb-border bg-[rgba(10,9,7,0.5)] p-5 sm:mb-12 sm:p-8 lg:p-10">
          <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-gold">
            <span className="h-px w-8 bg-gold" />
            Design Showcase
          </p>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <h1
              className="text-[clamp(40px,7vw,88px)] font-light leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Inspired Living,
              <br />
              <em className="not-italic text-gold">Drawn to Detail</em>
            </h1>
            <div className="max-w-[460px]">
              <p className="text-sm leading-[1.8] text-cream-dim sm:text-[15px]">
                Browse our signature concepts, discover practical floor plans,
                and find the exact design language for your next home build.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/designs"
                  className="group relative overflow-hidden border border-gold px-6 py-3 text-[11px] uppercase tracking-[0.16em] text-gold transition-colors hover:text-ink"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 group-hover:translate-x-0" />
                  <span className="relative z-10">Browse All Plans</span>
                </Link>
                <Link
                  href="/custom-design"
                  className="text-[11px] uppercase tracking-[0.16em] text-cream-dim transition-colors hover:text-gold"
                >
                  Request Custom Design
                </Link>
              </div>
            </div>
          </div>
        </section>


        <div className="mb-10 hidden overflow-hidden border-y border-[rgba(240,232,216,0.08)] bg-card py-4 md:block">
          <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap">
            {["Architectural Excellence", "Kenyan Dream Homes", "Bespoke Blueprints", "Structural Drawings", "CAD Files Included", "Custom Designs Welcome", "Architectural Excellence", "Kenyan Dream Homes"].map((item, idx) => (
              <span key={`${item}-${idx}`} className="px-8 text-[14px] italic text-cream-dim">
                <span className="mr-7 inline-block h-[5px] w-[5px] rounded-full bg-gold align-middle" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-12 sm:space-y-16 md:space-y-20">
          <FeaturedDesigns onCardClick={setPreviewId} />
          <ExploreDesigns onCardClick={setPreviewId} />
        </div>
      </div>
      
      <DesignPreviewModal id={previewId} onClose={() => setPreviewId(null)} />
    </motion.main>
  );
};

export default DesignShowcasePage;
