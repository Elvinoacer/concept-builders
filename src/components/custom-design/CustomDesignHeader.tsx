"use client";


import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const CustomDesignHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader className="text-center">
        <CardTitle
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text"
        >
          Bring Your Vision to Life
        </CardTitle>
        <CardDescription
          className="text-base md:text-lg text-gray-600 dark:text-gray-400"
        >
          Tell us about your dream home, and our expert architects will craft a
          custom design tailored to your unique needs and preferences.
        </CardDescription>
      </CardHeader>
    </motion.div>
  );
};

export default CustomDesignHeader;

