"use client";
import CartItemList from "@/components/cart/CartItemList";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";

const CartPage = () => {
  const { data: session, status } = useSession();
  const { cart, loading, error, fetchCart, removeItem, updateItem } = useCart();

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, fetchCart]);

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const shimmerVariants = {
    initial: { x: -1000 },
    animate: {
      x: 1000,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="h-12 w-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse mb-4"></div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg"
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-1/2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse w-32"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-lg sticky top-8"
              >
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mt-6"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <ShoppingBag className="w-24 h-24 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 blur-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-300 bg-clip-text text-transparent mb-6">
              Your Cart Awaits
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join our creative community to save your favorite designs, enjoy
              personalized recommendations, and access exclusive member
              benefits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Link
              href="/auth"
              className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden"
            >
              <motion.div
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <Sparkles className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Fast Delivery
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="h-12 w-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              {[1, 2].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg"
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-1/2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse w-32"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-lg sticky top-8"
              >
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mt-6"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-red-200 dark:border-red-800/50 shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchCart}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-300 bg-clip-text text-transparent">
                Your Cart
              </h1>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-600 dark:text-gray-300 mt-4"
            >
              Review your selected designs and proceed to checkout
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {cart && cart.length > 0 ? (
              <motion.div
                key="cart-with-items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col lg:flex-row gap-8"
              >
                {/* Cart Items */}
                <motion.div variants={itemVariants} className="lg:w-2/3">
                  <CartItemList
                    items={cart}
                    onRemove={removeItem}
                    onUpdate={updateItem}
                  />
                </motion.div>

                {/* Order Summary */}
                <motion.div variants={itemVariants} className="lg:w-1/3">
                  <div className="sticky top-8">
                    <OrderSummary items={cart} loading={loading} />
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-cart"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 dark:border-gray-700/50 shadow-2xl max-w-md w-full"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  >
                    <ShoppingBag className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Your Cart is Empty
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Discover amazing designs and start building your collection
                  </p>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/design-showcase"
                      className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden relative"
                    >
                      <motion.div
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                      <Sparkles className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      Explore Designs
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto"
                >
                  {[
                    { icon: Shield, text: "Secure Payment", color: "green" },
                    { icon: Truck, text: "Fast Delivery", color: "blue" },
                    {
                      icon: Sparkles,
                      text: "Premium Quality",
                      color: "purple",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="text-center p-4"
                    >
                      <div
                        className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3`}
                      >
                        <feature.icon
                          className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`}
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {feature.text}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default CartPage;
