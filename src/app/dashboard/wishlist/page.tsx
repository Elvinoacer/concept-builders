"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, XCircle } from "lucide-react"; // Added XCircle for remove, Search for search input

interface WishlistItem {
  id: string;
  name: string;
  basePrice: number; // Added basePrice
  files: { url: string; type: string }[];
}

// Skeleton Loader Component
const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse"
      >
        <div className="relative h-40 sm:h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-3 sm:p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

const WishlistPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items per page

  const fetchWishlist = async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/wishlist");
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data: WishlistItem[] = await response.json();
      setWishlist(data);
      toast.success("Wishlist loaded successfully!");
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      toast.error(`Failed to load your wishlist: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [session]);

  const handleRemoveFromWishlist = async (designId: string) => {
    if (!session) {
      toast.error("You must be logged in to remove items from wishlist.");
      return;
    }

    if (!confirm("Are you sure you want to remove this design from your wishlist?")) {
      return;
    }

    // Optimistic update
    const originalWishlist = [...wishlist];
    setWishlist((prev) => prev.filter((item) => item.id !== designId));
    toast.info("Removing item from wishlist...");

    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ designId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }
      toast.success("Design removed from wishlist!");
    } catch (error: any) {
      console.error("Error removing from wishlist:", error);
      setWishlist(originalWishlist); // Revert optimistic update
      toast.error(`Failed to remove design: ${error.message}`);
    }
  };

  const handleAddToCart = async (designId: string) => {
    if (!session) {
      toast.error("You must be logged in to add items to cart.");
      router.push("/login"); // Redirect to login
      return;
    }

    toast.info("Adding design to cart...");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ designId, quantity: 1 }), // Assuming quantity 1 for now
      });

      if (!response.ok) {
        throw new Error("Failed to add design to cart");
      }
      toast.success("Design added to cart!");
      // Optionally, you might want to remove it from wishlist after adding to cart
      // handleRemoveFromWishlist(designId); // This would require confirmation or a different UX flow
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(`Failed to add design to cart: ${error.message}`);
    }
  };

  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [wishlist, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWishlist.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWishlist, currentPage, itemsPerPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
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
        <WishlistSkeleton />
      </div>
    );
  }

  if (wishlist.length === 0 && !searchTerm) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-8 text-center flex flex-col items-center justify-center">
        <Heart className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Looks like you haven't added any designs to your wishlist yet. Start
          exploring and save your favorite plans!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/designs")}
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

      {/* Search and Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search wishlist..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        {filteredWishlist.length > itemsPerPage && ( // Only show pagination if there are more items than can fit on one page
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {currentItems.length === 0 && searchTerm ? (
        <div className="dark:bg-gray-900 min-h-[300px] p-8 text-center flex flex-col items-center justify-center">
          <Search className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No results found for "{searchTerm}"
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or browsing all designs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {currentItems.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group"
            >
              <div className="relative h-40 sm:h-48">
                <Image
                  src={
                    design.files.find((file) => file.type === "IMAGE")?.url ||
                    "/placeholder.png" // Ensure /public/placeholder.png exists
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
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 mb-3">
                  ${design.basePrice.toFixed(2)}
                </p>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(design.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-md hover:from-blue-700 hover:to-cyan-500 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add to Cart</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveFromWishlist(design.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Remove</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
