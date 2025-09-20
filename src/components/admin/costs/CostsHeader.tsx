
"use client";

import { motion } from "framer-motion";

const CostsHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
        Costs
      </h1>
      <p className="text-muted-foreground mt-0.5 md:mt-1">
        Track your operational costs across all services.
      </p>
    </motion.header>
  );
};

export default CostsHeader;
