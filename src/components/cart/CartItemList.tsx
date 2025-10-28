"use client";
import React from "react";
import CartItem from "./CartItem";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartItemSkeleton = () => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg mb-4"
  >
    <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse"></div>
    <div className="ml-6 flex flex-1 flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
      </div>
      <div className="flex justify-between items-end">
        <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
        <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </motion.li>
);

const CartItemList = ({ items, onRemove, onUpdate, loading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className="hidden sm:grid grid-cols-4 gap-6 mb-6 px-4">
          <div className="col-span-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Product
          </div>
          <div className="text-right text-sm font-semibold text-gray-500 dark:text-gray-400">
            Total
          </div>
          <div></div>
        </div>
        <motion.ul
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[...Array(3)].map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </motion.ul>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden sm:grid grid-cols-4 gap-6 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30"
      >
        <div className="col-span-2 text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          PRODUCT DETAILS
        </div>
        <div className="text-right text-sm font-semibold text-blue-600 dark:text-blue-400">
          TOTAL
        </div>
        <div></div>
      </motion.div>

      {/* Cart Items */}
      <AnimatePresence mode="wait">
        <motion.ul
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <CartItem item={item} onRemove={onRemove} onUpdate={onUpdate} />
            </motion.div>
          ))}
        </motion.ul>
      </AnimatePresence>

      {/* Continue Shopping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-6 border-t border-gray-100 dark:border-gray-700"
      >
        <Link
          href="/designs"
          className="group inline-flex items-center gap-3 px-6 py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-300 border border-blue-100 dark:border-blue-800/30 hover:shadow-lg hover:scale-105"
        >
          <motion.div
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ArrowLeft size={18} />
          </motion.div>
          <span>Continue Exploring Designs</span>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default CartItemList;
