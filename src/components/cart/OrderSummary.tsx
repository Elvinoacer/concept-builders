"use client";
import { useCart } from "@/hooks/useCart";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe, Lock, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OrderSummary = ({ items, loading }) => {
  const { cartTotal, appliedDiscountAmount } = useCart();
  const [usdToKesRate, setUsdToKesRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsFetchingRate(true);
      setRateError(null);
      try {
        const res = await fetch("/api/exchange-rate");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch exchange rate");
        }
        const data = await res.json();
        setUsdToKesRate(data.usdToKesRate);
      } catch (err: any) {
        setRateError(err.message);
        toast.error(`Exchange rate error: ${err.message}`);
      } finally {
        setIsFetchingRate(false);
      }
    };
    fetchExchangeRate();
  }, []);

  const subtotal = cartTotal;
  const total = cartTotal - appliedDiscountAmount;
  const totalKES = usdToKesRate ? (total * usdToKesRate).toFixed(2) : "N/A";

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl"
      >
        <div className="h-7 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
              <div className="h-5 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl sticky top-8"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          Order Summary
        </h2>
      </motion.div>

      {/* Pricing Details */}
      <motion.div variants={containerVariants} className="space-y-4 mb-8">
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between py-3"
        >
          <dt className="text-gray-600 dark:text-gray-300 font-medium">
            Subtotal
          </dt>
          <dd className="font-semibold text-gray-900 dark:text-white text-lg">
            ${subtotal.toFixed(2)}
          </dd>
        </motion.div>

        {appliedDiscountAmount > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl px-4 -mx-2"
          >
            <dt className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Discount Applied
            </dt>
            <dd className="font-semibold text-green-600 dark:text-green-400 text-lg">
              -${appliedDiscountAmount.toFixed(2)}
            </dd>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-700"
        >
          <dt className="text-xl font-bold text-gray-900 dark:text-white">
            Total Amount
          </dt>
          <dd className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${total.toFixed(2)}
          </dd>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl px-4 -mx-2"
        >
          <dt className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Total (KES)
          </dt>
          <dd className="font-semibold text-blue-600 dark:text-blue-400">
            <AnimatePresence mode="wait">
              {isFetchingRate ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </motion.span>
              ) : rateError ? (
                <motion.span
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  Rate Error
                </motion.span>
              ) : (
                <motion.span
                  key="rate"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  KES {totalKES}
                </motion.span>
              )}
            </AnimatePresence>
          </dd>
        </motion.div>
      </motion.div>

      {/* Checkout Button */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/checkout" className="block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
              initial={{ x: -1000 }}
              animate={{ x: 1000 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10 flex items-center justify-center gap-3">
              <span>Proceed to Checkout</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Security Badge */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="w-5 h-5 text-green-500" />
        </motion.div>
        <span className="font-medium">256-bit SSL Secure Checkout</span>
        <Lock className="w-4 h-4" />
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
      >
        {[
          { icon: Zap, text: "Fast", subtext: "Delivery" },
          { icon: Shield, text: "Secure", subtext: "Payment" },
          { icon: Sparkles, text: "Premium", subtext: "Quality" },
        ].map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="text-center"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <badge.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {badge.text}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {badge.subtext}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;
