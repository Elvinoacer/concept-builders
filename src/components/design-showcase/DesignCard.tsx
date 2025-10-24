"use client";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface File {
  url: string;
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
}

interface DesignCardProps {
  design: Design;
  index: number;
  showDetails?: boolean;
}

const DesignCard: React.FC<DesignCardProps> = ({ design, index, showDetails = true }) => {
  const router = useRouter();
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const isBestSeller = design.orderItems && design.orderItems.length > 10;

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
          src={design.files[0]?.url || "/images/category-placeholder.png"}
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
        <h3 className="font-semibold text-slate-800 dark:text-white">
          {design.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {truncateDescription(design.description, 100)}
        </p>
        {showDetails && (
          <p className="text-lg font-semibold text-slate-800 dark:text-white mt-2">
            {formatCurrency(design.basePrice)}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default DesignCard;
