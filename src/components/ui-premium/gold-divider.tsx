"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoldDividerProps {
  className?: string;
  icon?: React.ReactNode;
  width?: string;
}

const GoldDivider = ({ className, icon, width = "w-full" }: GoldDividerProps) => {
  return (
    <div className={cn("flex items-center justify-center my-8 sm:my-12", width, className)}>
      <motion.div
        className="flex-grow h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {icon && (
        <motion.div
          className="mx-4 text-gold/80"
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        >
          {icon}
        </motion.div>
      )}
      <motion.div
        className="flex-grow h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};

export default GoldDivider;
