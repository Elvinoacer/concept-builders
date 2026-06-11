"use client";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

interface File {
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
  images: File[];
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

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  index,
  showDetails = true,
  priceType,
  onCardClick,
}) => {
  const router = useRouter();

  const hasDiscount = design.discounts && design.discounts.length > 0;
  const imageUrl =
    design.images?.[0]?.url || "/images/category-placeholder.webp";

  const minPrice = design.basePrice;
  const maxPrice =
    design.basePrice +
    (design.architecturalPdfPrice || 0) +
    (design.architecturalCadPrice || 0) +
    (design.structuralPdfPrice || 0) +
    (design.structuralCadPrice || 0) +
    (design.billOfQuantitiesPrice || 0);

  const discountValue = hasDiscount ? design.discounts![0].discount.value : 0;
  const discountedPrice = minPrice * (1 - discountValue / 100);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4,
        delay: index * 0.05,
      },
    },
  };

  const imageHoverVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const serifSystem = 'var(--font-cormorant-garamond), "Cormorant Garamond", serif';

  return (
    <motion.div
      onClick={() => (onCardClick ? onCardClick(design.id) : router.push(`/designs/${design.id}`))}
      className="group relative cursor-pointer w-full bg-ink transition-all duration-300 hover:bg-card border border-cb-border hover:border-gold/35 hover:shadow-[inset_0_0_0_1px_rgba(200,137,42,0.4)]"
      variants={cardVariants as any}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover="hover"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <motion.div variants={imageHoverVariants} className="w-full h-full">
          <Image
            alt={design.name}
            className="w-full h-full object-cover"
            src={imageUrl}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={index < 6}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          />
        </motion.div>

        {/* Top-left badge only */}
        {design.isFeatured && (
          <div className="absolute top-4 left-4 z-20">
            <span className="flex items-center border border-gold/35 bg-gold/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
              <FaStar className="mr-1.5 text-ink text-[10px]" />
              Featured
            </span>
          </div>
        )}

        {/* Gradient overlay for metadata strip */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

        {/* Bottom-left metadata strip */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
              {design.category?.name || "Uncategorized"}
            </p>
            {design.views !== undefined && (
              <p className="text-[10px] tracking-[0.1em] text-muted">
                {design.views.toLocaleString()} views
              </p>
            )}
          </div>
          
          <h3
            className="mb-2 line-clamp-1 text-2xl font-light text-cream transition-colors group-hover:text-gold-light"
            style={{ fontFamily: serifSystem }}
          >
            {design.name}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted mb-4">
            <span>{design.bedrooms ?? "-"} Beds</span>
            <span className="text-gold/40">•</span>
            <span>{design.bathrooms ?? "-"} Baths</span>
            <span className="text-gold/40">•</span>
            <span>{design.area ?? "-"} m²</span>
          </div>

          <div className="flex items-center justify-between border-t border-[rgba(240,232,216,0.08)] pt-4 transition-transform duration-300 group-hover:-translate-y-0.5">
            {priceType === "building" && design.minBuildingCost && design.maxBuildingCost ? (
              <p className="text-xl font-light text-cream" style={{ fontFamily: serifSystem }}>
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted mr-1 font-sans">Build from</span>
                {formatCurrency(design.minBuildingCost)}
              </p>
            ) : (
              <div className="flex items-center gap-2">
                {design.basePrice === 0 ? (
                  <p className="text-xl font-light text-cream" style={{ fontFamily: serifSystem }}>
                    Custom Quote
                  </p>
                ) : hasDiscount ? (
                  <div className="flex flex-col">
                    <p className="text-sm text-muted line-through font-light leading-none mb-0.5">{formatCurrency(minPrice)}</p>
                    <p className="text-xl font-light text-emerald-400 leading-none" style={{ fontFamily: serifSystem }}>{formatCurrency(discountedPrice)}</p>
                  </div>
                ) : (
                  <p className="text-xl font-light text-cream" style={{ fontFamily: serifSystem }}>
                    {formatCurrency(minPrice)}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-cream-dim transition-colors group-hover:text-gold">
              <span className="sr-only sm:not-sr-only">View Plan</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
