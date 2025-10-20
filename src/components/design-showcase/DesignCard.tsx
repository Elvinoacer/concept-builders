"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface File {
  id: string;
  url: string;
  type: string;
  originalFileName: string;
}

interface Design {
  id: string;
  name: string;
  description: string;
  files: File[];
}

interface DesignCardProps {
  design: Design;
  index: number;
}

const DesignCard: React.FC<DesignCardProps> = ({ design, index }) => {
  const router = useRouter();
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      onClick={() => router.push(`/designs/${design.id}`)}
      className="group overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-md transition-shadow hover:shadow-xl cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Image
        alt={design.name}
        className="w-full h-32 sm:h-40 object-cover"
        src={design.files[0]?.url || '/images/category-placeholder.png'}
        width={300}
        height={160}
      />
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-white">
          {design.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {truncateDescription(design.description, 100)}
        </p>
      </div>
    </motion.div>
  );
};

export default DesignCard;
