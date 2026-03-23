"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "ink" | "surface" | "card";
  animate?: boolean;
  id?: string;
}

const PageSection = ({
  children,
  className,
  variant = "ink",
  animate = true,
  id,
}: PageSectionProps) => {
  const bgClasses = {
    ink: "bg-ink",
    surface: "bg-surface",
    card: "bg-card",
  };

  const content = (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
        bgClasses[variant],
        className
      )}
    >
      {children}
    </section>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default PageSection;
