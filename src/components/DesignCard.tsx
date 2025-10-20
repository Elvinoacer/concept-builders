import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface File {
  id: string;
  url: string;
  type: string;
  originalFileName: string;
}

interface Design {
  id: string | number;
  name: string;
  description: string;
  basePrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  files?: File[];
  image?: string;
  category?: {
    name: string;
  } | string;
  pricing?: {
    pdf: number;
    cad: number;
    fullPackage: number;
  };
  details?: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    floors: number;
  };
}

const DesignCard = ({ design }: { design: Design }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Calculate rotation based on mouse position
  const rotateX = isHovered ? mousePosition.y / 10 - 15 : 0;
  const rotateY = isHovered ? mousePosition.x / 10 - 20 : 0;

  const categoryName = typeof design.category === 'string' ? design.category : design.category?.name;
  const imageUrl = design.image || design.files?.[0]?.url || "/placeholder.jpg";
  const price = design.basePrice || design.pricing?.pdf;
  const bedrooms = design.bedrooms || design.details?.bedrooms;
  const bathrooms = design.bathrooms || design.details?.bathrooms;
  const area = design.area || design.details?.area;

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[400px] rounded-3xl overflow-hidden cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(`/designs/${design.id}`)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
          : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
        transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease",
        boxShadow: isHovered
          ? "0 45px 100px rgba(0, 0, 0, 0.4), 0 16px 40px rgba(0, 0, 0, 0.4)"
          : "0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.19)",
      }}
    >
      {/* Background shine effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 60%)`,
        }}
      />

      {/* Image container with parallax effect */}
      <div className="relative w-full h-60 overflow-hidden">
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
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Floating badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg">
            Featured
          </span>
          <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg">
            New
          </span>
        </div>

        {/* Favorite button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-red-500/90 transition-colors duration-300 shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle favorite logic here
          }}
        >
          <span className="material-symbols-outlined text-base">favorite</span>
        </button>
      </div>

      {/* Content area */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-1 group-hover:text-blue-300 transition-colors duration-300">
            {design.name}
          </h3>
          <p className="text-sm text-gray-300">{categoryName}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-blue-300">${price}</p>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-base">bed</span>
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-base">bathtub</span>
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-base">square_foot</span>
              <span>{area} sqft</span>
            </div>
          </div>
        </div>

        {/* View button that slides in on hover */}
        <div className="overflow-hidden">
          <div
            className="transform transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "translateY(0)" : "translateY(100%)" }}
          >
            <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
              <span>View Details</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Border highlight effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 2px rgba(59, 130, 246, 0.5)",
        }}
      />
    </div>
  );
};

export default DesignCard;
