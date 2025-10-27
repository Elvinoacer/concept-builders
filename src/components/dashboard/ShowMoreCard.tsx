"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ShowMoreCard = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="min-w-[320px] h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center"
    >
      <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">add_circle</span>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Show More Designs</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Explore our full collection of designs.</p>
      <button
        onClick={() => router.push("/designs")}
        className="text-white bg-gradient-to-r from-blue-600 to-cyan-400 hover:shadow-lg transition-shadow mt-6 inline-block px-8 py-3 rounded-full font-bold text-lg"
      >
        Explore Designs
      </button>
    </motion.div>
  );
};

export default ShowMoreCard;
