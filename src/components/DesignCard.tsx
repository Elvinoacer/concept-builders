"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Design, File, Category } from "@/generated/prisma/browser";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Heart,
  BedDouble,
  Bath,
  Square,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";

interface DesignWithRelations extends Design {
  images: File[];
  category: Category;
}

const DesignCard = ({
  design,
  isFavorited = false,
}: {
  design: DesignWithRelations;
  isFavorited?: boolean;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [favorited, setFavorited] = useState(isFavorited);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      signIn("google");
      return;
    }

    try {
      const response = await fetch(`/api/designs/${design.id}/favorite`, {
        method: "POST",
      });

      if (response.ok) {
        setFavorited(!favorited);
        toast.success(
          favorited ? "Removed from favorites" : "Added to favorites",
        );
      } else {
        toast.error("Failed to update favorites");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsHovered(false);
  };

  const handleTouch = () => {
    if (isMobile) {
      setIsHovered(!isHovered);
    }
  };

  const rotateX = isHovered && !isMobile ? mousePosition.y / 10 - 15 : 0;
  const rotateY = isHovered && !isMobile ? mousePosition.x / 10 - 20 : 0;

  const categoryName = design.category.name;
  const imageUrl =
    design.images?.[0]?.url || "/images/category-placeholder.png";
  const price = design.basePrice;
  const bedrooms = design.bedrooms;
  const bathrooms = design.bathrooms;
  const area = design.area;

  const cardVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: !isMobile
      ? {
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeInOut" },
        }
      : {},
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isMobile ? "hover" : undefined}
      className="relative w-full h-[320px] xs:h-[340px] sm:h-[380px] rounded-2xl overflow-hidden cursor-pointer group bg-card backdrop-blur-md border-2 border-cb-border hover:border-gold/50 transition-all duration-500 shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTouch}
      onDoubleClick={() => router.push(`/designs/${design.id}`)}
      style={{
        transform:
          isHovered && !isMobile
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : "none",
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.15)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Background Effects */}
      {isHovered && !isMobile && (
        <>
          <div
            className="absolute inset-0 opacity-100 transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0) 60%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-100 transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 60%)`,
            }}
          />
        </>
      )}

      {/* Image Container */}
      <div className="relative w-full h-36 xs:h-40 sm:h-44 overflow-hidden">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={imageUrl}
            alt={design.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="px-2 py-1 bg-gold/90 backdrop-blur-md text-ink text-xs font-medium rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
          <span className="px-2 py-1 bg-surface/90 backdrop-blur-md text-cream text-xs font-medium rounded-full shadow-lg border border-cb-border">
            New
          </span>
        </div>

        {/* Favorite Button */}
        <motion.button
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-ink/60 backdrop-blur-md rounded-xl text-cream ${favorited ? "text-gold" : "hover:text-gold"} transition-all duration-300 shadow-xl z-20 border border-gold/20`}
          onClick={handleFavorite}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-4 h-4 ${favorited ? "fill-gold text-gold" : ""}`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 text-cream bg-gradient-to-t from-ink/95 via-ink/80 to-transparent">
        {/* Title and Category */}
        <div className="mb-3">
          <h3
            className="text-lg xs:text-xl font-black mb-1 group-hover:text-gold transition-colors duration-500 line-clamp-1 uppercase tracking-tight"
          >
            {design.name}
          </h3>
          <p className="text-xs xs:text-sm text-gold/60 font-bold uppercase tracking-widest line-clamp-1">
            {categoryName}
          </p>
        </div>

        {/* Price and Features */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-4 gap-2 xs:gap-0">
          <p className="text-xl xs:text-2xl font-black text-gold">
            ${price?.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 xs:gap-3 text-[10px] xs:text-xs text-cream font-bold uppercase tracking-tighter">
            <div className="flex items-center gap-1.5 backdrop-blur-md bg-surface/50 px-2.5 py-1.5 rounded-lg border border-cb-border shadow-lg">
              <BedDouble className="w-3 h-3 text-gold" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 backdrop-blur-md bg-surface/50 px-2.5 py-1.5 rounded-lg border border-cb-border shadow-lg">
              <Bath className="w-3 h-3 text-gold" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 backdrop-blur-md bg-surface/50 px-2.5 py-1.5 rounded-lg border border-cb-border shadow-lg">
              <Square className="w-3 h-3 text-gold" />
              <span>{area} <span className="text-[8px] opacity-60">SQFT</span></span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{
            height: isHovered || isMobile ? "auto" : 0,
            opacity: isHovered || isMobile ? 1 : 0,
            marginTop: isHovered || isMobile ? 16 : 0,
          }}
          transition={{ duration: 0.4, ease: "circOut" }}
        >
          <motion.button
            onClick={() => router.push(`/designs/${design.id}`)}
            className="w-full py-3 bg-gold hover:bg-gold-light text-ink font-black rounded-xl text-xs xs:text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Border Glow Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-2xl opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 2px rgba(212, 175, 55, 0.4)",
          }}
        />
      )}
    </motion.div>
  );
};

export default DesignCard;
