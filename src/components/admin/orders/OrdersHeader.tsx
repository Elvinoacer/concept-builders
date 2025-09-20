"use client";

import { motion } from "framer-motion";

const OrdersHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Orders
          </h2>
          <p className="text-gray-500 text-sm mt-0.5 md:mt-1 dark:text-gray-400">
            Manage and process orders and refunds
          </p>
        </div>
      </div>
    </motion.header>
  );
};

export default OrdersHeader;
