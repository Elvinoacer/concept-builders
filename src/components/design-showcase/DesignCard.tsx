"use client";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  files: File[];
  isFeatured?: boolean;
  discounts?: Discount[];
  orderItems?: OrderItem[];
  basePrice: number;
  minBuildingCost?: number;
  maxBuildingCost?: number;
}

interface DesignCardProps {
  design: Design;
  index: number;
  showDetails?: boolean;
  priceType?: string;
}

const DesignCard: React.FC<DesignCardProps> = ({ design, index, showDetails = true, priceType }) => {
  const router = useRouter();
  

  const isBestSeller = design.orderItems && design.orderItems.length > 10;

  const imageUrl = design.files?.find(file => file.type === 'IMAGE')?.url || "/images/category-placeholder.png";

  return (
    <motion.div
      onClick={() => router.push(`/designs/${design.id}`)}
      className="group overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-md transition-shadow hover:shadow-xl cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative">
        <Image
          alt={design.name}
          className="w-full h-32 sm:h-40 object-cover"
          src={imageUrl}
          width={300}
          height={160}
        />
        {showDetails && (
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {design.isFeatured && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Featured
              </span>
            )}
            {design.discounts && design.discounts.length > 0 && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                On Offer
              </span>
            )}
            {isBestSeller && (
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Best Seller
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
          {design.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 h-20 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
          {design.description}
        </p>
        {showDetails && (
          <div className="mt-2">
            {priceType === 'building' && design.minBuildingCost && design.maxBuildingCost ? (
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Est. Build: {formatCurrency(design.minBuildingCost)} - {formatCurrency(design.maxBuildingCost)}
              </p>
            ) : (
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {formatCurrency(design.basePrice)}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DesignCard;
