"use client";

import { motion } from "framer-motion";
import { ordersTabsData } from "@/lib/dummydata/orders";

const OrdersTabs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="border-b border-gray-200 dark:border-gray-800"
    >
      <div className="flex gap-4 md:gap-6 px-1 overflow-x-auto whitespace-nowrap">
        {ordersTabsData.map((tab, index) => (
          <a
            key={index}
            href={tab.href}
            className={`flex flex-col items-center justify-center border-b-2 ${
              index === 0
                ? "border-b-primary text-primary dark:text-blue-400 dark:border-b-blue-400"
                : "border-b-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            } pb-3 pt-2`}
          >
            <p className={`text-sm ${index === 0 ? "font-semibold" : "font-medium"}`}>
              {tab.name}
            </p>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default OrdersTabs;
