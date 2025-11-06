"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Design, File, Category } from "@/generated/prisma";
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
          favorited ? "Removed from favorites" : "Added to favorites"
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

  const cardVariants = {
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
      className="relative w-full h-[300px] xs:h-[320px] sm:h-[350px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTouch}
      onDoubleClick={() => router.push(`/designs/${design.id}`)}
      style={{
        transform:
          isHovered && !isMobile
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
            : "none",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)"
          : "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Background Effects */}
      {isHovered && !isMobile && (
        <>
          <div
            className="absolute inset-0 opacity-100 transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-100 transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 60%)`,
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
            className="object-cover"
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
          <span className="px-2 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg">
            New
          </span>
        </div>

        {/* Favorite Button */}
        <motion.button
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white ${favorited ? "hover:bg-gray-500/90" : "hover:bg-red-500/90"} transition-colors duration-300 shadow-lg z-10`}
          onClick={handleFavorite}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-3.5 h-3.5 ${favorited ? "fill-red-500 text-red-500" : ""}`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 text-white bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        {/* Title and Category */}
        <div className="mb-2 xs:mb-3">
          <h3 className="text-base xs:text-lg font-bold mb-1 group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
            {design.name}
          </h3>
          <p className="text-xs xs:text-sm text-gray-300 line-clamp-1">
            {categoryName}
          </p>
        </div>

        {/* Price and Features */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-3 gap-2 xs:gap-0">
          <p className="text-lg xs:text-xl font-bold text-blue-300">
            ${price?.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 xs:gap-3 text-xs xs:text-sm text-gray-300">
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full">
              <BedDouble className="w-3 h-3" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full">
              <Bath className="w-3 h-3" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full">
              <Square className="w-3 h-3" />
              <span>{area} sqft</span>
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
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => router.push(`/designs/${design.id}`)}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-xs xs:text-sm transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </motion.button>
        </motion.div>
      </div>

      {/* Border Glow Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 2px rgba(59, 130, 246, 0.3)",
          }}
        />
      )}
    </motion.div>
  );
};

export default DesignCard;
