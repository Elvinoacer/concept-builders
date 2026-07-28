"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { formatCurrency, getDesignImages } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

interface DesignImage {
  url: string;
  type: string;
}

interface Discount {
  discount: {
    id: string;
    code: string;
    type: string;
    value: number;
  };
}

interface OrderItem {
  id: string;
}

interface Design {
  id: string;
  name: string;
  description?: string;
  images: DesignImage[];
  files?: DesignImage[];
  isFeatured?: boolean;
  discounts?: Discount[];
  orderItems?: OrderItem[];
  basePrice: number;
  architecturalPdfPrice?: number;
  architecturalCadPrice?: number;
  structuralPdfPrice?: number;
  structuralCadPrice?: number;
  billOfQuantitiesPrice?: number;
  minBuildingCost?: number;
  maxBuildingCost?: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  floors?: number | null;
  category?: { id: string; name: string } | null;
  views?: number;
}

interface DesignCardProps {
  design: Design;
  index: number;
  showDetails?: boolean;
  priceType?: string;
  /** @deprecated Prefer default navigation to /designs/[id]. Kept for rare non-navigation cases. */
  onCardClick?: (id: string) => void;
}

const FALLBACK_IMAGE = "/images/category-placeholder.webp";

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  index,
  showDetails = true,
  priceType,
  onCardClick,
}) => {
  const hasDiscount = design.discounts && design.discounts.length > 0;
  const imageUrls = getDesignImages(design, 4);
  const gallery = imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE];

  const [activeImage, setActiveImage] = useState(0);
  const [imgSrc, setImgSrc] = useState(gallery[0]);
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setActiveImage(0);
    setImgSrc(gallery[0] || FALLBACK_IMAGE);
    // gallery identity is derived from design images; re-sync when design changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design.id, gallery.join("|")]);

  useEffect(() => {
    setImgSrc(gallery[activeImage] || FALLBACK_IMAGE);
  }, [activeImage, gallery]);

  const stopImageCycle = useCallback(() => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
  }, []);

  const startImageCycle = useCallback(() => {
    if (gallery.length <= 1) return;
    stopImageCycle();
    hoverIntervalRef.current = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % gallery.length);
    }, 900);
  }, [gallery.length, stopImageCycle]);

  useEffect(() => () => stopImageCycle(), [stopImageCycle]);

  const minPrice = design.basePrice;
  const discountValue = hasDiscount ? design.discounts![0].discount.value : 0;
  const discountedPrice = minPrice * (1 - discountValue / 100);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        delay: index * 0.04,
      },
    },
  };

  const serifSystem =
    'var(--font-cormorant-garamond), "Cormorant Garamond", serif';

  const href = `/designs/${design.id}`;

  const handleActivate = (e: React.MouseEvent) => {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(design.id);
    }
  };

  return (
    <motion.div
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.35rem] border border-[rgba(240,232,216,0.12)] bg-[linear-gradient(180deg,rgba(30,28,22,0.96),rgba(14,13,10,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-all duration-300 hover:border-gold/55 hover:shadow-[0_24px_70px_rgba(0,0,0,0.35),0_0_0_1px_rgba(200,137,42,0.12)]"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      viewport={{ once: true, amount: 0.1 }}
      onMouseEnter={startImageCycle}
      onMouseLeave={() => {
        stopImageCycle();
        setActiveImage(0);
      }}
    >
      <Link
        href={href}
        onClick={handleActivate}
        className="absolute inset-0 z-10"
        aria-label={`Explore ${design.name}`}
        prefetch={index < 6}
      />

      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Image — multi-view teaser for architectural inspiration */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/25">
        <Image
          alt={`${design.name}${gallery.length > 1 ? ` — view ${activeImage + 1}` : ""}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={imgSrc}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 4}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />

        {design.isFeatured && (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="flex items-center bg-gold/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink shadow-lg">
              <FaStar className="mr-1 text-ink text-[10px]" />
              Featured
            </span>
          </div>
        )}

        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none flex items-center gap-1.5">
            <span className="bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
              {activeImage + 1}/{gallery.length} views
            </span>
            <div className="flex gap-1">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-1 rounded-full transition-colors ${
                    i === activeImage ? "bg-gold" : "bg-white/35"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-black/10 to-black/20 opacity-75" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#13120E] to-transparent" />
      </div>

      <div className="relative z-[5] flex min-h-[170px] flex-1 flex-col justify-between p-5 sm:p-6 pointer-events-none">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase leading-none tracking-[0.22em] text-gold/90">
            {design.category?.name || "House Plan"}
          </p>

          <h3
            className="mb-3 line-clamp-1 text-[1.35rem] font-light leading-tight text-cream transition-colors duration-300 group-hover:text-gold-light"
            style={{ fontFamily: serifSystem }}
          >
            {design.name}
          </h3>

          {showDetails && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              <span>
                {design.bedrooms ?? "-"} Bed
                {design.bedrooms === 1 ? "" : "s"}
              </span>
              <span className="text-gold/30">·</span>
              <span>
                {design.bathrooms ?? "-"} Bath
                {design.bathrooms === 1 ? "" : "s"}
              </span>
              <span className="text-gold/30">·</span>
              <span>{design.area ?? "-"} m²</span>
              {design.floors !== undefined && design.floors !== null && (
                <>
                  <span className="text-gold/30">·</span>
                  <span>
                    {design.floors} Floor{design.floors === 1 ? "" : "s"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[rgba(240,232,216,0.1)] pt-4">
          {priceType === "building" && design.minBuildingCost ? (
            <div>
              <p className="mb-1 text-[10px] uppercase leading-none tracking-[0.12em] text-muted">
                Est. Build Cost
              </p>
              <p
                className="text-base font-light text-cream"
                style={{ fontFamily: serifSystem }}
              >
                from {formatCurrency(design.minBuildingCost)}
              </p>
            </div>
          ) : (
            <div>
              <p className="mb-1 text-[10px] uppercase leading-none tracking-[0.12em] text-muted">
                Plan Price
              </p>
              <div className="flex items-center gap-2">
                {design.basePrice === 0 ? (
                  <p
                    className="text-base font-light text-cream"
                    style={{ fontFamily: serifSystem }}
                  >
                    Custom Quote
                  </p>
                ) : hasDiscount ? (
                  <div className="flex items-baseline gap-2">
                    <p className="text-xs font-light text-muted line-through">
                      {formatCurrency(minPrice)}
                    </p>
                    <p
                      className="text-base font-light text-emerald-400"
                      style={{ fontFamily: serifSystem }}
                    >
                      {formatCurrency(discountedPrice)}
                    </p>
                  </div>
                ) : (
                  <p
                    className="text-base font-light text-cream"
                    style={{ fontFamily: serifSystem }}
                  >
                    {formatCurrency(minPrice)}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(240,232,216,0.1)] bg-cream/5 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors duration-300 group-hover:border-gold/35 group-hover:bg-gold/10 group-hover:text-gold">
            <span>Explore design</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
