"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  level?: 1 | 2 | 3;
  className?: string;
  gradient?: boolean;
}

const SectionHeading = ({
  title,
  subtitle,
  align = "left",
  level = 2,
  className,
  gradient = false,
}: SectionHeadingProps) => {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
  };

  const HeadingTag = `h${level}` as any;

  const headingClasses = cn(
    "font-black uppercase tracking-tight leading-tight",
    {
      "text-2xl sm:text-3xl md:text-4xl text-gold": level === 3,
      "text-3xl sm:text-4xl md:text-5xl text-gold": level === 2,
      "text-4xl sm:text-6xl md:text-7xl text-gold": level === 1,
      "bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent": gradient,
    },
    className
  );

  return (
    <div className={cn("flex flex-col mb-8 sm:mb-12", alignClasses[align])}>
      <motion.div
        initial={{ opacity: 0, x: align === "left" ? -20 : 0, scale: align === "center" ? 0.95 : 1 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <HeadingTag className={headingClasses}>{title}</HeadingTag>
        {subtitle && (
          <p className="mt-4 text-cream-dim text-base sm:text-lg md:text-xl font-medium max-w-2xl uppercase tracking-widest">
            {subtitle}
          </p>
        )}
        <div className={cn(
          "h-1.5 bg-gold mt-6 rounded-full",
          align === "left" ? "w-24" : "w-32"
        )} />
      </motion.div>
    </div>
  );
};

export default SectionHeading;
