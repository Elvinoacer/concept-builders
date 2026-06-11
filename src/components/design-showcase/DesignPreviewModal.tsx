"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ModalImage {
  url: string;
  type: string;
  name?: string;
}

interface ModalDesign {
  id: string;
  name: string;
  description: string;
  images: ModalImage[];
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

const FALLBACK_IMAGE = "/images/category-placeholder.webp";

const DesignPreviewModal = ({ id, onClose }: DesignPreviewModalProps) => {
  const [design, setDesign] = useState<ModalDesign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter images to only show actual images (not files/documents)
  const displayImages =
    design?.images?.filter(
      (img) =>
        img.type === "IMAGE" ||
        img.url?.match(/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i)
    ) ?? [];

  // If no valid images found, use fallback
  const images =
    displayImages.length > 0
      ? displayImages
      : [{ url: FALLBACK_IMAGE, type: "IMAGE" }];

  // Active image source state to handle error fallback smoothly
  const activeImageUrl = images[activeIndex]?.url || FALLBACK_IMAGE;
  const [activeImgSrc, setActiveImgSrc] = useState(activeImageUrl);

  useEffect(() => {
    setActiveImgSrc(activeImageUrl);
  }, [activeImageUrl, activeIndex]);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setActiveIndex((prev) => {
        let nextIndex = prev + newDirection;
        if (nextIndex < 0) nextIndex = images.length - 1;
        if (nextIndex >= images.length) nextIndex = 0;
        return nextIndex;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!id) {
      setDesign(null);
      return;
    }

    let cancelled = false;
    const fetchDesign = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/designs/${id}`);
        if (!response.ok) throw new Error("Failed to load design");
        const data = await response.json();
        if (!cancelled) {
          setDesign(data);
          setActiveIndex(0);
          setDirection(0);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDesign();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Body scroll lock
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

  // Keyboard handling
  useEffect(() => {
    if (!id) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (images.length <= 1) return;
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, images.length, onClose, paginate]);

  const buildCustomDesignUrl = (d: ModalDesign) => {
    const params = new URLSearchParams();
    params.set("inspired_by", d.id);
    if (d.category?.name) params.set("style", d.category.name);
    if (images?.[0]?.url && images[0].url !== FALLBACK_IMAGE)
      params.set("image", images[0].url);
    return `/custom-design?${params.toString()}`;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  const serifSystem =
    'var(--font-cormorant-garamond), "Cormorant Garamond", serif';

  if (!id) return null;

  return (
    <AnimatePresence>
      {id && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop click-to-close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal container — fixed flex column with max height limits */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.5rem] border border-[rgba(240,232,216,0.14)] bg-[linear-gradient(180deg,rgba(19,18,14,0.98),rgba(10,9,7,0.99))] shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:max-h-[88dvh]"
          >
            {loading ? (
              /* ── Loading skeleton ── */
              <div className="grid lg:grid-cols-[1.1fr_1fr] flex-1">
                <div className="aspect-[16/10] lg:aspect-auto animate-pulse bg-card/40" />
                <div className="p-6 flex flex-col gap-4 justify-between">
                  <div className="space-y-4">
                    <div className="h-3 w-20 animate-pulse bg-card/40 rounded" />
                    <div className="h-8 w-3/4 animate-pulse bg-card/40 rounded" />
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 animate-pulse bg-card/40 rounded"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-16 animate-pulse bg-card/40 mt-4 rounded" />
                </div>
              </div>
            ) : error ? (
              /* ── Error state ── */
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-10 text-center flex-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Failed to load design details
                </p>
                <button
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                    fetch(`/api/designs/${id}`)
                      .then((r) => r.json())
                      .then((d) => {
                        setDesign(d);
                        setActiveIndex(0);
                      })
                      .catch(() => setError(true))
                      .finally(() => setLoading(false));
                  }}
                  className="border border-gold/30 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gold hover:border-gold transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : design ? (
              /* ── Main content ── */
              <>
                {/* 1. FIXED HEADER */}
                <div className="z-20 flex flex-shrink-0 items-center justify-between gap-4 border-b border-[rgba(240,232,216,0.1)] bg-[#0C0B08]/95 px-4 py-3 sm:px-6 sm:py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-medium mb-1">
                      {design.category?.name ?? "House Plan"}
                    </p>
                    <h2
                      id="modal-title"
                      className="line-clamp-1 text-xl font-light leading-tight text-cream sm:text-2xl"
                      style={{ fontFamily: serifSystem }}
                    >
                      {design.name}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-colors hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* 2. SCROLLABLE BODY */}
                <div className="grid min-h-0 flex-1 overflow-y-auto bg-[#0F0E0A] lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.78fr)]">
                  {/* Left: Image Carousel Column */}
                  <div className="flex min-h-0 flex-col border-b border-cb-border bg-black/15 lg:border-b-0 lg:border-r">
                    {/* Main image */}
                    <div className="group relative aspect-[16/10] max-h-[48vh] w-full flex-shrink-0 overflow-hidden bg-card/10 lg:aspect-auto lg:h-full lg:min-h-[460px] lg:max-h-none">
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={activeIndex}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: {
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            },
                            opacity: { duration: 0.2 },
                          }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={activeImgSrc}
                            alt={`${design.name} - View ${activeIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                            onError={() => setActiveImgSrc(FALLBACK_IMAGE)}
                          />
                        </motion.div>
                      </AnimatePresence>

                      {images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              paginate(-1);
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center border border-white/20 bg-black/50 text-white hover:border-gold/50 hover:text-gold transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              paginate(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center border border-white/20 bg-black/50 text-white hover:border-gold/50 hover:text-gold transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <span className="absolute top-3 left-3 bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/80">
                            {activeIndex + 1} / {images.length}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 py-3 flex-shrink-0 bg-black/5">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setDirection(i > activeIndex ? 1 : -1);
                              setActiveIndex(i);
                            }}
                            className={`relative flex-shrink-0 h-10 w-14 overflow-hidden border transition-all ${
                              i === activeIndex
                                ? "border-gold opacity-100"
                                : "border-cb-border opacity-50 hover:opacity-90 hover:border-gold/40"
                            }`}
                          >
                            <Image
                              src={img.url}
                              alt={`Thumbnail ${i + 1}`}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Details Panel Column */}
                  <div className="flex flex-col justify-start gap-5 overflow-y-auto p-4 sm:p-6">
                    {/* Stats grid */}
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-gold font-medium mb-3">
                        Specifications
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                        {[
                          {
                            label: "Beds",
                            value: design.bedrooms ?? "—",
                          },
                          {
                            label: "Baths",
                            value: design.bathrooms ?? "—",
                          },
                          {
                            label: "Area",
                            value: design.area
                              ? `${design.area} m²`
                              : "—",
                          },
                          {
                            label: "Floors",
                            value: design.floors ?? "—",
                          },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-xl border border-[rgba(240,232,216,0.1)] bg-ink/55 px-2 py-3 text-center"
                          >
                            <p className="text-base font-light text-cream leading-tight">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-gold font-medium mb-2.5">
                        Plan Description
                      </p>
                      <p className="max-h-40 overflow-y-auto pr-1 text-xs font-light leading-[1.85] text-cream-dim lg:max-h-56">
                        {design.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. STICKY FOOTER */}
                <div className="z-20 flex flex-shrink-0 flex-col items-stretch justify-between gap-4 border-t border-[rgba(240,232,216,0.1)] bg-[#0C0B08]/95 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted mb-0.5 leading-none">
                      Blueprint Package
                    </p>
                    {design.basePrice === 0 ? (
                      <p
                        className="text-xl font-light text-cream"
                        style={{ fontFamily: serifSystem }}
                      >
                        Custom Quote
                      </p>
                    ) : (
                      <p
                        className="text-xl font-light text-gold"
                        style={{ fontFamily: serifSystem }}
                      >
                        <span className="text-[10px] uppercase tracking-[0.12em] text-muted mr-1.5 font-sans">
                          from
                        </span>
                        {formatCurrency(design.basePrice)}
                      </p>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    {design.basePrice > 0 && (
                      <Link
                        href={`/designs/${design.id}`}
                        onClick={onClose}
                        className="group relative flex flex-1 items-center justify-center overflow-hidden rounded-full border border-gold bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-light sm:flex-initial"
                      >
                        View Full Plan
                        <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                    <Link
                      href={buildCustomDesignUrl(design)}
                      onClick={onClose}
                      className={`flex items-center justify-center rounded-full border border-cb-border px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream-dim transition-colors hover:border-gold/40 hover:bg-gold/5 hover:text-gold ${
                        design.basePrice === 0 ? "w-full" : "flex-1 sm:flex-initial"
                      }`}
                    >
                      Request Custom Design
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DesignPreviewModal;
