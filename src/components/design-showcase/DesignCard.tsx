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
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -6,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const imageHoverVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      onClick={() => router.push(`/designs/${design.id}`)}
      className="group relative cursor-pointer w-full max-w-sm mx-auto"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover="hover"
    >
      {/* Subtle Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      {/* Main Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-200/50 dark:group-hover:border-cyan-400/30 w-full">
        {/* Image Container */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden">
          <motion.div variants={imageHoverVariants} className="w-full h-full">
            <Image
              alt={design.name}
              className="w-full h-full object-cover"
              src={imageUrl}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 6}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
            />
          </motion.div>

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

          {/* Strategic Badge Placement - Top Left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20 max-w-[70%]">
            {design.isFeatured && (
              <motion.span
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaStar className="mr-1 text-yellow-200 text-xs" />
                Featured
              </motion.span>
            )}
            {hasDiscount && (
              <motion.span
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="mr-1 text-xs">🎁</span>
                {discountValue}% Off
              </motion.span>
            )}
          </div>

          {/* Status Badges - Top Right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            {isBestSeller && (
              <motion.span
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaFire className="mr-1 text-xs" />
                Best Seller
              </motion.span>
            )}
            {isPopular && !isBestSeller && (
              <motion.span
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaHeart className="mr-1 text-xs" />
                Popular
              </motion.span>
            )}
          </div>

          {/* Quick Actions - Appear on Hover */}
          <div className="absolute top-14 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <motion.button
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-lg shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // Add to favorites logic
              }}
            >
              <FaHeart className="text-red-500 text-xs" />
            </motion.button>
            <motion.button
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-lg shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // Quick view logic
              }}
            >
              <FaEye className="text-blue-500 text-xs" />
            </motion.button>
          </div>

          {/* Property Stats - Bottom Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <motion.div
                  className="bg-black/70 backdrop-blur-md text-white px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaLayerGroup className="mr-1" />
                  {design.floors || 1}{" "}
                  {design.floors === 1 ? "Floor" : "Floors"}
                </motion.div>
                <motion.div
                  className="bg-black/70 backdrop-blur-md text-white px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaExpandArrowsAlt className="mr-1" />
                  {design.area} m²
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 md:p-6">
          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
              {design.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
              {design.description}
            </p>
          </div>

          {/* Property Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
              <FaBed className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-semibold">{design.bedrooms || 0} Beds</span>
            </div>
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
              <FaBath className="mr-2 text-cyan-500 flex-shrink-0" />
              <span className="font-semibold">
                {design.bathrooms || 0} Baths
              </span>
            </div>
          </div>

          {/* Pricing Section */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              {priceType === "building" &&
              design.minBuildingCost &&
              design.maxBuildingCost ? (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-semibold">
                    Estimated Build Cost
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(design.minBuildingCost)} -{" "}
                      {formatCurrency(design.maxBuildingCost)}
                    </p>
                    <motion.span
                      className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-semibold"
                      whileHover={{ scale: 1.05 }}
                    >
                      Cost Guide
                    </motion.span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-semibold">
                    Design Package
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(discountedPrice)}
                          </p>
                          <p className="text-sm text-gray-400 line-through">
                            {formatCurrency(minPrice)}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {minPrice === maxPrice
                            ? formatCurrency(minPrice)
                            : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                        </p>
                      )}
                    </div>
                    <motion.div
                      className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShoppingCart className="mr-2" />
                      View
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subtle Hover Indicator */}
          <motion.div
            className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-4 group-hover:w-full transition-all duration-500"
            initial={false}
            whileHover={{ width: "100%" }}
          />
        </div>

        {/* Subtle Corner Accent on Hover */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
