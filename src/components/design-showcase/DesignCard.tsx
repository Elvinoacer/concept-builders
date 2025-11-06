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
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover="hover"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-xl xs:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 group-hover:border-blue-200/50 dark:group-hover:border-cyan-400/30 w-full">
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          <div className="absolute top-2 xs:top-3 left-2 xs:left-3 flex flex-wrap gap-1 xs:gap-2 z-20 max-w-[65%]">
            {design.isFeatured && (
              <motion.span
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold px-1.5 xs:px-2 py-1 xs:py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaStar className="mr-1 text-yellow-200 text-xs" />
                <span className="hidden xs:inline">Featured</span>
                <span className="xs:hidden">Feat.</span>
              </motion.span>
            )}
            {hasDiscount && (
              <motion.span
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-1.5 xs:px-2 py-1 xs:py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="mr-1 text-xs">🎁</span>
                {discountValue}% Off
              </motion.span>
            )}
          </div>

          <div className="absolute top-2 xs:top-3 right-2 xs:right-3 flex flex-col gap-1 xs:gap-2 z-20">
            {isBestSeller && (
              <motion.span
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-1.5 xs:px-2 py-1 xs:py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaFire className="mr-1 text-xs" />
                <span className="hidden xs:inline">Best Seller</span>
                <span className="xs:hidden">Hot</span>
              </motion.span>
            )}
            {isPopular && !isBestSeller && (
              <motion.span
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-1.5 xs:px-2 py-1 xs:py-1.5 rounded-lg shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaHeart className="mr-1 text-xs" />
                <span className="hidden xs:inline">Popular</span>
                <span className="xs:hidden">Pop.</span>
              </motion.span>
            )}
          </div>

          <div className="absolute top-12 xs:top-14 right-2 xs:right-3 flex flex-col gap-1 xs:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hidden sm:flex">
            <motion.button
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-1.5 xs:p-2 rounded-lg shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FaHeart className="text-red-500 text-xs xs:text-sm" />
            </motion.button>
            <motion.button
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-1.5 xs:p-2 rounded-lg shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FaEye className="text-blue-500 text-xs xs:text-sm" />
            </motion.button>
          </div>

          <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 right-2 xs:right-3">
            <div className="flex justify-between items-center">
              <div className="flex gap-1 xs:gap-2">
                <motion.div
                  className="bg-black/70 backdrop-blur-md text-white px-1.5 xs:px-2 py-1 xs:py-1.5 rounded-lg text-xs font-semibold flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaLayerGroup className="mr-1 text-xs" />
                  <span className="hidden xs:inline">
                    {design.floors || 1}{" "}
                    {design.floors === 1 ? "Floor" : "Floors"}
                  </span>
                  <span className="xs:hidden">{design.floors || 1}F</span>
                </motion.div>
                {design.area && (
                  <motion.div
                    className="bg-black/70 backdrop-blur-md text-white px-1.5 xs:px-2 py-1 xs:py-1.5 rounded-lg text-xs font-semibold flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaExpandArrowsAlt className="mr-1 text-xs" />
                    <span className="hidden xs:inline">{design.area} m²</span>
                    <span className="xs:hidden">{design.area}m²</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 xs:p-4 sm:p-5">
          <div className="mb-3 xs:mb-4">
            <h3 className="font-bold text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white mb-1 xs:mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
              {design.name}
            </h3>
            <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
              {design.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 xs:gap-3 mb-3 xs:mb-4">
            <div className="flex items-center text-xs xs:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
              <FaBed className="mr-1 xs:mr-2 text-blue-500 flex-shrink-0 text-xs xs:text-sm" />
              <span className="font-semibold truncate">
                {design.bedrooms || 0} Beds
              </span>
            </div>
            <div className="flex items-center text-xs xs:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
              <FaBath className="mr-1 xs:mr-2 text-cyan-500 flex-shrink-0 text-xs xs:text-sm" />
              <span className="font-semibold truncate">
                {design.bathrooms || 0} Baths
              </span>
            </div>
          </div>

          {showDetails && (
            <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              {priceType === "building" &&
              design.minBuildingCost &&
              design.maxBuildingCost ? (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 xs:mb-2 uppercase tracking-wide font-semibold">
                    Build Cost
                  </p>
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
                    <p className="text-xs xs:text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                      {formatCurrency(design.minBuildingCost)} -{" "}
                      {formatCurrency(design.maxBuildingCost)}
                    </p>
                    <motion.span
                      className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-semibold w-fit"
                      whileHover={{ scale: 1.05 }}
                    >
                      Cost Guide
                    </motion.span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 xs:mb-2 uppercase tracking-wide font-semibold">
                    Design Package
                  </p>
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
                    <div className="flex items-center gap-1 xs:gap-2 min-w-0">
                      {hasDiscount ? (
                        <>
                          <p className="text-xs xs:text-sm sm:text-base font-bold text-green-600 dark:text-green-400 truncate">
                            {formatCurrency(discountedPrice)}
                          </p>
                          <p className="text-xs text-gray-400 line-through flex-shrink-0">
                            {formatCurrency(minPrice)}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs xs:text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                          {minPrice === maxPrice
                            ? formatCurrency(minPrice)
                            : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                        </p>
                      )}
                    </div>
                    <motion.div
                      className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg text-xs xs:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 min-h-[2.5rem] xs:min-h-[2.75rem] w-full xs:w-auto"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShoppingCart className="mr-1 xs:mr-2 flex-shrink-0" />
                      <span>View Details</span>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          )}

          <motion.div
            className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-3 xs:mt-4 group-hover:w-full transition-all duration-300"
            initial={false}
            whileHover={{ width: "100%" }}
          />
        </div>

        <div className="absolute top-0 right-0 w-6 h-6 xs:w-8 xs:h-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[12px] xs:border-l-[16px] border-l-transparent border-t-[12px] xs:border-t-[16px] border-t-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
