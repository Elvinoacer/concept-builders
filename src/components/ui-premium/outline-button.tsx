"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const OutlineButton = ({
  children,
  icon,
  fullWidth = false,
  className,
  ...props
}: OutlineButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-surface border-2 border-cb-border text-cream font-black uppercase tracking-[0.2em] text-xs hover:border-gold/50 hover:text-gold transition-all duration-500",
        fullWidth ? "w-full" : "w-fit",
        className
      )}
      {...(props as any)}
    >
      {icon && <span className="text-xl text-gold/60 group-hover:text-gold transition-colors">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default OutlineButton;
