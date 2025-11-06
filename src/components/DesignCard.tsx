"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Design, File, Category } from "@/generated/prisma";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";

interface DesignWithRelations extends Design {
  images: File[];
  category: Category;
}

const DesignCard = ({
  design,
  isFavorited,
}: {
  design: DesignWithRelations;
  isFavorited: boolean;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [favorited, setFavorited] = useState(isFavorited);

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
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const rotateX = isHovered ? mousePosition.y / 10 - 15 : 0;
  const rotateY = isHovered ? mousePosition.x / 10 - 20 : 0;

  const categoryName = design.category.name;
  const imageUrl =
    design.images?.[0]?.url || "/images/category-placeholder.png";
  const price = design.basePrice;
  const bedrooms = design.bedrooms;
  const bathrooms = design.bathrooms;
  const area = design.area;

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[320px] xs:h-[350px] sm:h-[380px] md:h-[400px] rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(`/designs/${design.id}`)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
          : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
        transition:
          "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease",
        boxShadow: isHovered
          ? "0 25px 60px rgba(0, 0, 0, 0.3), 0 10px 25px rgba(0, 0, 0, 0.3)"
          : "0 8px 25px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.12)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 60%)`,
        }}
      />

      <div className="relative w-full h-40 xs:h-44 sm:h-48 md:h-60 overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          style={{
            transform: isHovered
              ? `translateX(${mousePosition.x / 20 - 10}px) translateY(${mousePosition.y / 20 - 7.5}px)`
              : "none",
          }}
        >
          <Image
            src={imageUrl}
            alt={design.name}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4 flex gap-1 xs:gap-2">
          <span className="px-2 xs:px-3 py-1 bg-blue-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg">
            Featured
          </span>
          <span className="px-2 xs:px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg">
            New
          </span>
        </div>

        <button
          className={`absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white ${favorited ? "hover:bg-gray-500/90" : "hover:bg-red-500/90"} transition-colors duration-300 shadow-lg`}
          onClick={handleFavorite}
        >
          <span
            className="material-symbols-outlined text-xs xs:text-sm"
            style={{ color: favorited ? "red" : "white" }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-5 text-white bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        <div className="mb-2 xs:mb-3">
          <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-1 group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
            {design.name}
          </h3>
          <p className="text-xs xs:text-sm text-gray-300 line-clamp-1">
            {categoryName}
          </p>
        </div>

        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-3 xs:mb-4 gap-2 xs:gap-0">
          <p className="text-xl xs:text-2xl font-bold text-blue-300">
            ${price}
          </p>
          <div className="flex items-center gap-2 xs:gap-3 xs:gap-4 text-xs xs:text-sm text-gray-300">
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
              <span className="material-symbols-outlined text-xs xs:text-base">
                bed
              </span>
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
              <span className="material-symbols-outlined text-xs xs:text-base">
                bathtub
              </span>
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
              <span className="material-symbols-outlined text-xs xs:text-base">
                square_foot
              </span>
              <span>{area} sqft</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="transform transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? "translateY(0)" : "translateY(100%)",
            }}
          >
            <button className="w-full py-2 xs:py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg xs:rounded-xl text-xs xs:text-sm transition-colors duration-300 flex items-center justify-center gap-1 xs:gap-2">
              <span>View Details</span>
              <span className="material-symbols-outlined text-xs xs:text-base">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-xl xs:rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 2px rgba(59, 130, 246, 0.5)",
        }}
      />
    </div>
  );
};

export default DesignCard;
