"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  name: string;
  files: { url: string; type: string }[];
}

const WishlistPage = () => {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session) return;
      try {
        const response = await fetch("/api/wishlist");
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }
        const data: WishlistItem[] = await response.json();
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load your wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [session]);

  if (loading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-8 text-center text-gray-500 dark:text-gray-400">
        Loading wishlist...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Looks like you haven't added any designs to your wishlist yet.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/designs")}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors"
        >
          Browse Designs
        </motion.button>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-6 md:mb-8">
        <h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          My Wishlist
        </h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base dark:text-gray-400">
          Here are the designs you have saved for later.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((design, index) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group"
          >
            <div className="relative h-40 sm:h-48">
              <Image
                src={
                  design.files.find((file) => file.type === "IMAGE")?.url ||
                  "/placeholder.png"
                }
                alt={design.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                {design.name}
              </h4>
              <div className="mt-3 sm:mt-4 flex flex-row md:flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-md hover:from-blue-700 hover:to-cyan-500 transition-colors">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    shopping_cart
                  </span>
                  <span>Add to Cart</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
