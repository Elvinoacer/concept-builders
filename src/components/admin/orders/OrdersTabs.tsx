"use client";

import { motion } from "framer-motion";

const OrdersTabs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="border-b border-gray-200 dark:border-gray-800"
    >
      <div className="flex gap-4 md:gap-6 px-1 overflow-x-auto whitespace-nowrap">
        <a
          href="#"
          className="flex flex-col items-center justify-center border-b-2 border-b-primary text-primary pb-3 pt-2 dark:text-blue-400 dark:border-b-blue-400"
        >
          <p className="text-sm font-semibold">All</p>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center border-b-2 border-b-transparent text-gray-500 pb-3 pt-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <p className="text-sm font-medium">Pending</p>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center border-b-2 border-b-transparent text-gray-500 pb-3 pt-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <p className="text-sm font-medium">Completed</p>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center border-b-2 border-b-transparent text-gray-500 pb-3 pt-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <p className="text-sm font-medium">Refunds</p>
        </a>
      </div>
    </motion.div>
  );
};

export default OrdersTabs;
