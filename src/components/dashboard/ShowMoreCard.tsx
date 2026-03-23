"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, ArrowRight, Grid3X3 } from "lucide-react";
import { useState, useEffect } from "react";

const ShowMoreCard = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full h-[300px] xs:h-[320px] sm:h-[350px] flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-dashed border-cb-border hover:border-gold/50 p-6 text-center cursor-pointer transition-all duration-300 group"
      onClick={() => router.push("/designs")}
    >
      {/* Icon */}
      <motion.div
        className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
      >
        <Plus className="w-8 h-8 text-ink" />
      </motion.div>

      {/* Content */}
      <h3 className="text-lg xs:text-xl font-bold text-cream mb-2 group-hover:text-gold transition-colors duration-300">
        {isMobile ? "More Designs" : "Discover More Designs"}
      </h3>

      <p className="text-cream-dim text-sm xs:text-base mb-4 leading-relaxed max-w-xs">
        {isMobile
          ? "Explore our full collection"
          : "Browse our complete catalog of architectural designs and find your perfect match"}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted mb-4">
        <div className="flex items-center gap-1">
          <Grid3X3 className="w-3 h-3" />
          <span>100+ Designs</span>
        </div>
        <div className="w-px h-4 bg-cb-border"></div>
        <div className="flex items-center gap-1">
          <span>⭐ 4.8</span>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-ink font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm xs:text-base group/btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Explore All</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
      </motion.button>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl sm:rounded-2xl">
        <div className="absolute -inset-10 bg-gradient-to-br from-gold/5 to-gold/3 transform rotate-12"></div>
      </div>
    </motion.div>
  );
};

export default ShowMoreCard;
