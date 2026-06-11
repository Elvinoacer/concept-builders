"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface ModalDesign {
  id: string;
  name: string;
  description: string;
  images: { url: string; type: string; name?: string }[];
  category?: { id: string; name: string };
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  floors?: number | null;
  basePrice: number;
}

interface DesignPreviewModalProps {
  id: string | null;
  onClose: () => void;
}

const DesignPreviewModal = ({ id, onClose }: DesignPreviewModalProps) => {
  const [design, setDesign] = useState<ModalDesign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDesign = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/designs/${id}`);
        if (!response.ok) throw new Error("Failed to load design");
        const data = await response.json();
        setDesign(data);
        setActiveIndex(0);
        setDirection(0);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [id]);

  useEffect(() => {
    if (id) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!design || design.images.length <= 1) return;
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, design, onClose]);

  const paginate = (newDirection: number) => {
    if (!design) return;
    setDirection(newDirection);
    setActiveIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex < 0) nextIndex = design.images.length - 1;
      if (nextIndex >= design.images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const buildCustomDesignUrl = (d: ModalDesign) => {
    const params = new URLSearchParams();
    params.set("inspired_by", d.id);
    if (d.category?.name) params.set("style", d.category.name);
    if (d.images?.[0]?.url) params.set("image", d.images[0].url);
    return `/custom-design?${params.toString()}`;
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 60 : -60,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {id && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-ink border border-cb-border shadow-2xl max-h-full overflow-y-auto flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {loading ? (
              <div className="grid lg:grid-cols-2 min-h-[480px]">
                <div className="aspect-[4/3] animate-pulse bg-card/60" />
                <div className="p-6 sm:p-8 flex flex-col gap-4">
                  <div className="h-3 w-24 animate-pulse bg-card/60" />
                  <div className="h-10 w-3/4 animate-pulse bg-card/60" />
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 animate-pulse bg-card/60" />)}
                  </div>
                  <div className="h-24 animate-pulse bg-card/60 mt-4" />
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-10 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Failed to load design details</p>
                <button onClick={() => window.location.reload()} className="border border-gold/30 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gold hover:border-gold">
                  Refresh Page
                </button>
              </div>
            ) : design ? (
              <div className="grid lg:grid-cols-[1.2fr_1fr] min-h-[480px]">
                {/* Image Carousel */}
                <div className="flex flex-col bg-black/20 border-b lg:border-b-0 lg:border-r border-cb-border">
                  <div className="relative aspect-[4/3] w-full bg-card overflow-hidden group">
                    <AnimatePresence initial={false} custom={direction}>
                      <motion.div
                        key={activeIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={design.images[activeIndex]?.url || "/images/category-placeholder.webp"}
                          alt={`${design.name} - View ${activeIndex + 1}`}
                          fill
                          className="object-cover opacity-90"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {design.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center border border-white/20 bg-black/50 text-white hover:border-gold/50 hover:text-gold transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); paginate(1); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center border border-white/20 bg-black/50 text-white hover:border-gold/50 hover:text-gold transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <span className="absolute top-4 left-4 bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/80">
                          {activeIndex + 1} / {design.images.length}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {design.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide p-4">
                      {design.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setDirection(i > activeIndex ? 1 : -1);
                            setActiveIndex(i);
                          }}
                          className={`relative flex-shrink-0 h-16 w-24 overflow-hidden border transition-all ${
                            i === activeIndex
                              ? "border-gold opacity-100"
                              : "border-cb-border opacity-50 hover:opacity-100 hover:border-gold/40"
                          }`}
                        >
                          <Image src={img.url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Panel */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <p className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-gold">
                      <span className="h-px w-6 bg-gold" />
                      {design.category?.name ?? "House Plan"}
                    </p>
                    <h2
                      id="modal-title"
                      className="text-[clamp(28px,4vw,42px)] font-light leading-tight text-cream mb-6"
                      style={{ fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif' }}
                    >
                      {design.name}
                    </h2>

                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {[
                        { label: "Beds", value: design.bedrooms ?? "—" },
                        { label: "Baths", value: design.bathrooms ?? "—" },
                        { label: "Area", value: design.area ? `${design.area} m²` : "—" },
                        { label: "Floors", value: design.floors ?? "—" },
                      ].map((stat) => (
                        <div key={stat.label} className="border border-cb-border bg-ink/60 p-3 text-center">
                          <p className="text-xl font-light text-cream">{stat.value}</p>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <p className="line-clamp-4 text-[13px] leading-[1.8] text-cream-dim">
                      {design.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-cb-border">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted mb-2">Design Plan</p>
                    <div className="mb-6">
                      {design.basePrice === 0 ? (
                        <p className="text-3xl font-light text-cream" style={{ fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif' }}>
                          Custom Quote
                        </p>
                      ) : (
                        <p className="text-3xl font-light text-cream" style={{ fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif' }}>
                          <span className="text-[11px] uppercase tracking-[0.12em] text-muted mr-2 font-sans">from</span>
                          ${design.basePrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {design.basePrice > 0 && (
                        <Link
                          href={`/designs/${design.id}`}
                          className="group relative flex flex-1 items-center justify-center overflow-hidden border border-gold bg-gold px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-light"
                        >
                          View Full Plan
                          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                      <Link
                        href={buildCustomDesignUrl(design)}
                        className={`flex items-center justify-center border border-cb-border px-5 py-3.5 text-[11px] uppercase tracking-[0.18em] text-cream-dim transition-colors hover:border-gold/40 hover:text-gold ${design.basePrice === 0 ? 'w-full' : 'flex-1'}`}
                      >
                        Request Custom Design
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DesignPreviewModal;
