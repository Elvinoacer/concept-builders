"use client";
import React, { useState, useEffect } from "react";
import { formatCurrency, getPrimaryDesignImage } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const hasDiscount = design.discounts && design.discounts.length > 0;
  const resolvedImageUrl = getPrimaryDesignImage(design);
  const [imgSrc, setImgSrc] = useState(resolvedImageUrl);

  useEffect(() => {
    setImgSrc(resolvedImageUrl);
  }, [resolvedImageUrl]);

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

  return (
    <motion.div
      onClick={() =>
        onCardClick
          ? onCardClick(design.id)
          : router.push(`/designs/${design.id}`)
      }
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-[rgba(240,232,216,0.12)] bg-[linear-gradient(180deg,rgba(30,28,22,0.96),rgba(14,13,10,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-all duration-300 hover:border-gold/55 hover:shadow-[0_24px_70px_rgba(0,0,0,0.35),0_0_0_1px_rgba(200,137,42,0.12)]"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Image Container — 16:10 Horizontal aspect ratio for premium architectural layouts */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/25">
        <Image
          alt={design.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={imgSrc}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 4}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />

        {/* Featured badge */}
        {design.isFeatured && (
          <div className="absolute top-3 left-3 z-20">
            <span className="flex items-center bg-gold/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink shadow-lg">
              <FaStar className="mr-1 text-ink text-[10px]" />
              Featured
            </span>
          </div>
        )}

        {/* Subtle top/bottom gradient mask on image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-black/10 to-black/20 opacity-75" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#13120E] to-transparent" />
      </div>

      {/* Information Hierarchy Content Block */}
      <div className="flex min-h-[170px] flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Category Label */}
          <p className="mb-2 text-[10px] font-semibold uppercase leading-none tracking-[0.22em] text-gold/90">
            {design.category?.name || "House Plan"}
          </p>

          {/* Level 1: Design Name */}
          <h3
            className="mb-3 line-clamp-1 text-[1.35rem] font-light leading-tight text-cream transition-colors duration-300 group-hover:text-gold-light"
            style={{ fontFamily: serifSystem }}
          >
            {design.name}
          </h3>

          {/* Level 2: Quick Specs */}
          {showDetails && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              <span>{design.bedrooms ?? "-"} Bed{design.bedrooms === 1 ? "" : "s"}</span>
              <span className="text-gold/30">·</span>
              <span>{design.bathrooms ?? "-"} Bath{design.bathrooms === 1 ? "" : "s"}</span>
              <span className="text-gold/30">·</span>
              <span>{design.area ?? "-"} m²</span>
              {design.floors !== undefined && design.floors !== null && (
                <>
                  <span className="text-gold/30">·</span>
                  <span>{design.floors} Floor{design.floors === 1 ? "" : "s"}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Level 3 & 4: Price & CTA footer */}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[rgba(240,232,216,0.1)] pt-4">
          {priceType === "building" && design.minBuildingCost ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted leading-none mb-1">
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
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted leading-none mb-1">
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
                    <p className="text-xs text-muted line-through font-light">
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

          {/* Level 4: CTA */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(240,232,216,0.1)] bg-cream/5 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-cream-dim transition-colors duration-300 group-hover:border-gold/35 group-hover:bg-gold/10 group-hover:text-gold">
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
