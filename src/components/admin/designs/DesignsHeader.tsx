
"use client";

import { motion } from "framer-motion";

const DesignsHeader = ({ activeTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center mb-8"
    >
      <h2 className="text-3xl font-bold text-foreground">Designs</h2>
      {activeTab === "all" && (
        <button className="flex items-center justify-center gap-2 rounded-md h-10 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-medium shadow-sm hover:to-primary/80 transition-colors">
          <span className="material-symbols-outlined">add</span>
          <span>New Design</span>
        </button>
      )}
    </motion.div>
  );
};

export default DesignsHeader;
