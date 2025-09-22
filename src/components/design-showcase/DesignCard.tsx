"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Design {
  name: string;
  description: string;
  image: string;
}

interface DesignCardProps {
  design: Design;
  index: number;
}

const DesignCard: React.FC<DesignCardProps> = ({ design, index }) => {
  const router = useRouter();
  return (
    <motion.div
      onClick={() => router.push(`/designs/${(design as any).id}`)}
      className="group overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-md transition-shadow hover:shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Image
        alt={design.name}
        className="w-full h-32 sm:h-40 object-cover"
        src={design.image}
        width={300}
        height={160}
      />
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-white">
          {design.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {design.description}
        </p>
      </div>
    </motion.div>
  );
};

export default DesignCard;
