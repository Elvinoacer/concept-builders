"use client";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
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
  description: string;
  images: DesignImage[];
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
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floors?: number;
  category?: { id: string; name: string };
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

  // Find the first valid image — filter for IMAGE type or image file extensions
  const validImage = design.images?.find(
    (img) =>
      img.url &&
      (img.type === "IMAGE" ||
        img.url.match(/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i))
  );
  const imageUrl = validImage?.url || FALLBACK_IMAGE;

  const minPrice = design.basePrice;
  const discountValue = hasDiscount ? design.discounts![0].discount.value : 0;
  const discountedPrice = minPrice * (1 - discountValue / 100);

  const cardVariants = {
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
      className="group relative cursor-pointer w-full bg-ink transition-all duration-300 hover:bg-card border border-cb-border hover:border-gold/30 hover:shadow-[inset_0_0_0_1px_rgba(200,137,42,0.25)]"
      variants={cardVariants as any}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Image — 4/5 portrait ratio, good for house facades */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          alt={design.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          src={imageUrl}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 4}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
        />

        {/* Featured badge */}
        {design.isFeatured && (
          <div className="absolute top-3 left-3 z-20">
            <span className="flex items-center bg-gold/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink shadow-sm">
              <FaStar className="mr-1 text-ink text-[9px]" />
              Featured
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

        {/* Bottom metadata strip */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end">
          {/* Category + views row */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold">
              {design.category?.name || "Uncategorized"}
            </p>
            {design.views !== undefined && design.views > 0 && (
              <p className="text-[9px] tracking-[0.1em] text-muted">
                {design.views.toLocaleString()} views
              </p>
            )}
          </div>

          {/* Design name */}
          <h3
            className="mb-1.5 line-clamp-1 text-xl sm:text-2xl font-light text-cream transition-colors group-hover:text-gold-light"
            style={{ fontFamily: serifSystem }}
          >
            {design.name}
          </h3>

          {/* Specs inline */}
          {showDetails && (
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-muted mb-3">
              <span>{design.bedrooms ?? "-"} Beds</span>
              <span className="text-gold/30">·</span>
              <span>{design.bathrooms ?? "-"} Baths</span>
              <span className="text-gold/30">·</span>
              <span>{design.area ?? "-"} m²</span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-3 transition-transform duration-300 group-hover:-translate-y-px">
            {priceType === "building" &&
            design.minBuildingCost &&
            design.maxBuildingCost ? (
              <p
                className="text-lg font-light text-cream"
                style={{ fontFamily: serifSystem }}
              >
                <span className="text-[9px] uppercase tracking-[0.14em] text-muted mr-1 font-sans">
                  Build from
                </span>
                {formatCurrency(design.minBuildingCost)}
              </p>
            ) : (
              <div className="flex items-center gap-2">
                {design.basePrice === 0 ? (
                  <p
                    className="text-lg font-light text-cream"
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
                      className="text-lg font-light text-emerald-400"
                      style={{ fontFamily: serifSystem }}
                    >
                      {formatCurrency(discountedPrice)}
                    </p>
                  </div>
                ) : (
                  <p
                    className="text-lg font-light text-cream"
                    style={{ fontFamily: serifSystem }}
                  >
                    {formatCurrency(minPrice)}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-cream-dim transition-colors group-hover:text-gold">
              <span className="hidden sm:inline">View</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
