
"use client";

import { productViewsData } from "@/lib/dummydata";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ProductViewsChart = ({ data }: { data: any[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="flex flex-col">
        <h3 className="text-chart-2 text-base md:text-lg font-semibold">Product Views</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Top Products</p>
      </div>
      <div className="h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductViewsChart;
