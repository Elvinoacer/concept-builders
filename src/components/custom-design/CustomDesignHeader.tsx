"use client";


import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { customDesignHeader } from "@/lib/dummydata/customDesign";

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
          {customDesignHeader.title}
        </CardTitle>
        <CardDescription
          className="text-base md:text-lg text-gray-600 dark:text-gray-400"
        >
          {customDesignHeader.description}
        </CardDescription>
      </CardHeader>
    </motion.div>
  );
};

export default CustomDesignHeader;

