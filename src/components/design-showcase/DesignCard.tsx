"use client";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaBath,
  FaBed,
  FaLayerGroup,
  FaExpandArrowsAlt,
  FaHeart,
  FaEye,
  FaShoppingCart,
  FaStar,
  FaFire,
} from "react-icons/fa";

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
}

interface DesignCardProps {
  design: Design;
  index: number;
  showDetails?: boolean;
  priceType?: string;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  index,
  showDetails = true,
  priceType,
}) => {
  const router = useRouter();

  const isBestSeller = design.orderItems && design.orderItems.length > 10;
  const isPopular = design.orderItems && design.orderItems.length > 5;
  const hasDiscount = design.discounts && design.discounts.length > 0;
  const imageUrl =
    design.images?.[0]?.url || "/images/category-placeholder.png";

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
    hidden: {
      opacity: 0,
      y: 20,
    },
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

  const hoverVariants = {
    hover: {
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const imageHoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      onClick={() => router.push(`/designs/${design.id}`)}
      className="group relative cursor-pointer w-full"
      variants={cardVariants as any}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover="hover"
    >
      <div className="absolute inset-0 bg-gold/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100 -z-10 blur-xl" />

      <div className="relative w-full overflow-hidden border border-cb-border bg-[linear-gradient(160deg,rgba(26,24,19,0.95)_0%,rgba(17,16,9,0.92)_100%)] transition-all duration-500 group-hover:border-gold/35 group-hover:shadow-[0_24px_40px_rgba(0,0,0,0.35)]">
        <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 w-full overflow-hidden">
          <motion.div variants={imageHoverVariants} className="w-full h-full">
            <Image
              alt={design.name}
              className="w-full h-full object-cover"
              src={imageUrl}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={index < 6}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-55" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20 max-w-[75%]">
            {design.isFeatured && (
              <motion.span
                className="flex items-center border border-gold/35 bg-gold/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaStar className="mr-1.5 text-ink" />
                <span>Featured</span>
              </motion.span>
            )}
            {hasDiscount && (
              <motion.span
                className="flex items-center border border-emerald-400/40 bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-950"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="mr-1.5">🎁</span>
                {discountValue}% Off
              </motion.span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            {isBestSeller && (
              <motion.span
                className="flex items-center border border-gold/35 bg-gold/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaFire className="mr-1.5" />
                <span>Best Seller</span>
              </motion.span>
            )}
            {isPopular && !isBestSeller && (
              <motion.span
                className="flex items-center border border-gold/25 bg-surface/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaHeart className="mr-1.5" />
                <span>Popular</span>
              </motion.span>
            )}
          </div>

          <div className="absolute right-2 top-12 z-20 hidden opacity-0 transition-all duration-300 group-hover:opacity-100 xs:right-3 xs:top-14 sm:flex sm:flex-col sm:gap-2">
            <motion.button
              className="border border-cb-border bg-surface/90 p-1.5 xs:p-2 transition-all duration-300 hover:border-gold/30"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FaHeart className="text-destructive text-xs xs:text-sm" />
            </motion.button>
            <motion.button
              className="border border-cb-border bg-surface/90 p-1.5 xs:p-2 transition-all duration-300 hover:border-gold/30"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FaEye className="text-gold text-xs xs:text-sm" />
            </motion.button>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <motion.div
                  className="flex items-center border border-gold/20 bg-ink/65 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaLayerGroup className="mr-1.5" />
                  <span>
                    {design.floors || 1}{" "}
                    {design.floors === 1 ? "Floor" : "Floors"}
                  </span>
                </motion.div>
                {design.area && (
                  <motion.div
                    className="flex items-center border border-gold/20 bg-ink/65 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaExpandArrowsAlt className="mr-1.5" />
                    <span>{design.area} m²</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 xs:p-4 sm:p-5">
          <div className="mb-4">
            <h3
              className="mb-2 line-clamp-1 text-xl font-light text-cream transition-all duration-500 group-hover:translate-x-1 sm:text-2xl"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              {design.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-cream-dim">
              {design.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 xs:gap-3 mb-3 xs:mb-4">
            <div className="flex items-center border border-cb-border bg-surface px-2 xs:px-3 py-1.5 xs:py-2 text-xs text-cream xs:text-sm">
              <FaBed className="mr-1 xs:mr-2 text-gold flex-shrink-0 text-xs xs:text-sm" />
              <span className="truncate font-medium">
                {design.bedrooms || 0} Beds
              </span>
            </div>
            <div className="flex items-center border border-cb-border bg-surface px-2 xs:px-3 py-1.5 xs:py-2 text-xs text-cream xs:text-sm">
              <FaBath className="mr-1 xs:mr-2 text-gold flex-shrink-0 text-xs xs:text-sm" />
              <span className="truncate font-medium">
                {design.bathrooms || 0} Baths
              </span>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t-2 border-cb-border">
              {priceType === "building" &&
              design.minBuildingCost &&
              design.maxBuildingCost ? (
                <div>
                  <p className="text-[10px] text-gold/60 mb-2 uppercase tracking-[0.2em] font-black">
                    Build Cost
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-base font-semibold text-gold sm:text-lg">
                      {formatCurrency(design.minBuildingCost)} -{" "}
                      {formatCurrency(design.maxBuildingCost)}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] text-gold/60 mb-2 uppercase tracking-[0.15em] font-black">
                    Design Package
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {hasDiscount ? (
                        <>
                          <p className="truncate text-lg font-semibold text-emerald-400">
                            {formatCurrency(discountedPrice)}
                          </p>
                          <p className="text-xs text-muted line-through font-bold">
                            {formatCurrency(minPrice)}
                          </p>
                        </>
                      ) : (
                        <p className="truncate text-lg font-semibold text-gold">
                          {minPrice === maxPrice
                            ? formatCurrency(minPrice)
                            : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                        </p>
                      )}
                    </div>
                    <motion.div
                      className="flex w-full items-center justify-center bg-gold px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-all duration-500 hover:bg-gold-light sm:w-auto"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShoppingCart className="mr-2" />
                      <span>View Detail</span>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          )}

          <motion.div
            className="w-0 h-0.5 bg-gold rounded-full mt-3 xs:mt-4 group-hover:w-full transition-all duration-300"
            initial={false}
            whileHover={{ width: "100%" }}
          />
        </div>

        <div className="absolute right-0 top-0 h-6 w-6 overflow-hidden xs:h-8 xs:w-8">
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[12px] xs:border-l-[16px] border-l-transparent border-t-[12px] xs:border-t-[16px] border-t-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
