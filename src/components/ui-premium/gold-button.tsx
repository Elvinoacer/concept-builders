"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const GoldButton = ({
  children,
  icon,
  fullWidth = false,
  className,
  ...props
}: GoldButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gold text-ink font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold/10 hover:shadow-gold/20 hover:bg-gold-light transition-all duration-500",
        fullWidth ? "w-full" : "w-fit",
        className
      )}
      {...(props as any)}
    >
      {icon && <span className="text-xl transition-transform group-hover:rotate-12">{icon}</span>}
      <span className="relative z-10">{children}</span>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />
      </div>
    </motion.button>
  );
};

export default GoldButton;
