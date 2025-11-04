// DesignCard.tsx - Enhanced with better styling
"use client";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { FaBath, FaBed, FaLayerGroup, FaExpandArrowsAlt } from "react-icons/fa";

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

  return (
    <motion.div
      onClick={() => router.push(`/designs/${design.id}`)}
      className="group overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500 hover:border-primary/30"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 300 },
      }}
    >
      <div className="relative overflow-hidden">
        <Image
          alt={design.name}
          className="w-full h-40 sm:h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          src={imageUrl}
          width={400}
          height={192}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {showDetails && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {design.isFeatured && (
              <motion.span
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                Featured
              </motion.span>
            )}
            {design.discounts && design.discounts.length > 0 && (
              <motion.span
                className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                On Offer
              </motion.span>
            )}
            {isBestSeller && (
              <motion.span
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                Best Seller
              </motion.span>
            )}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {design.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {design.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <FaBed />
            <span>{design.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBath />
            <span>{design.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <FaExpandArrowsAlt />
            <span>{design.area} sqmt</span>
          </div>
          <div className="flex items-center gap-2">
            <FaLayerGroup />
            <span>{design.floors} Floors</span>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            {priceType === "building" &&
            design.minBuildingCost &&
            design.maxBuildingCost ? (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Estimated Build Cost
                </p>
                <p className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {formatCurrency(design.minBuildingCost)} -{" "}
                  {formatCurrency(design.maxBuildingCost)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Design Package
                </p>
                <p className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {minPrice === maxPrice
                    ? formatCurrency(minPrice)
                    : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                </p>
              </div>
            )}
          </div>
        )}

        <motion.div
          className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transition-all duration-500 mt-3"
          whileHover={{ width: "100%" }}
        />
      </div>
    </motion.div>
  );
};

export default DesignCard;
