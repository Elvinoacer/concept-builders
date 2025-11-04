"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, XCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart"; // Import the useCart hook

interface WishlistItem {
  id: string;
  name: string;
  basePrice: number;
  images: { url: string }[];
}

const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
      >
        <div className="relative h-48 bg-gray-300 dark:bg-gray-700"></div>
        <div className="p-4">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const WishlistPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCart } = useCart(); // Use the cart hook
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchWishlist = async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/wishlist");
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      const data: WishlistItem[] = await response.json();
      setWishlist(data);
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
      toast.error("You must be logged in to modify your wishlist.");
      return;
    }

    const originalWishlist = [...wishlist];
    setWishlist((prev) => prev.filter((item) => item.id !== designId));
    toast.promise(
      fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId }),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to remove item.");
        return res.json();
      }),
      {
        loading: "Removing from wishlist...",
        success: "Design removed from wishlist!",
        error: (err) => {
          setWishlist(originalWishlist);
          return `Failed to remove design: ${err.message}`;
        },
      }
    );
  };

  const handleAddToCart = async (designId: string) => {
    if (!session) {
      toast.error("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/designs/${designId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch design details.");
      }
      const design = await response.json();

      // Assuming default selections for file types, package, and extras
      // You might need a modal to let the user choose these options
      const defaultPackage = design.packages.find(p => p.isDefault) || design.packages[0];
      const selectedFileTypes = defaultPackage.files.map(f => f.id);

      await addToCart(design, selectedFileTypes, defaultPackage.id, []);
      toast.success("Design added to cart!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add design to cart.");
    }
  };

  const filteredWishlist = useMemo(
    () =>
      wishlist.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [wishlist, searchTerm]
  );

  const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);
  const currentItems = useMemo(
    () =>
      filteredWishlist.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredWishlist, currentPage]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Your saved designs for future projects.
          </p>
        </header>
        <WishlistSkeleton />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center text-center p-8">
        <Heart className="w-28 h-28 text-gray-300 dark:text-gray-700 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
          You haven’t added any designs yet. Explore our collection and save
          your favorites to build your dream home!
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/designs")}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Explore Designs
        </motion.button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          My Wishlist
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Your saved designs for future projects.
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your wishlist..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {currentItems.length === 0 && searchTerm ? (
        <div className="text-center py-16">
          <Search className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            No Results Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            No designs in your wishlist match "{searchTerm}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={design.images?.[0]?.url || "/images/category-placeholder.png"}
                  alt={design.name}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(design.id)}
                  className="absolute top-3 right-3 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 scale-0 group-hover:scale-100 transition-transform duration-200"
                  aria-label="Remove from wishlist"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {design.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1 mb-4">
                  ${design.basePrice.toFixed(2)}
                </p>
                <div className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAddToCart(design.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-500 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
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
