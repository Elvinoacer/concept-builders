"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
  id?: string;
}

const GlassCard = ({
  children,
  className,
  hover = true,
  animate = true,
  id,
}: GlassCardProps) => {
  const cardContent = (
    <div
      id={id}
      className={cn(
        "relative bg-card/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-cb-border shadow-2xl overflow-hidden transition-all duration-700",
        hover && "hover:border-gold/30 hover:shadow-gold/10 group",
        className
      )}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      
      {/* Hover Background Accent */}
      {hover && (
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 blur-3xl" />
      )}
      
      <div className="relative p-6 sm:p-8 md:p-10">
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default GlassCard;
