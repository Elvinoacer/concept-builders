"use client";
import ActionButtons from "@/components/purchase-confirmation/ActionButtons";
import ItemsPurchased from "@/components/purchase-confirmation/ItemsPurchased";
import PurchaseConfirmationHeader from "@/components/purchase-confirmation/PurchaseConfirmationHeader";
import PurchaseSummary from "@/components/purchase-confirmation/PurchaseSummary";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Home,
  Mail,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInvoiceGenerator } from "@/hooks/useInvoiceGenerator";

const PurchaseConfirmationPage = () => {
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("purchaseId");
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { generateInvoice } = useInvoiceGenerator();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (purchaseId) {
      const fetchPurchase = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch(`/api/purchases/${purchaseId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch purchase details");
          }
          const data = await response.json();
          setPurchase(data);
        } catch (error) {
          setError(error.message);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPurchase();
    } else {
      setLoading(false);
      setError("No purchase ID provided");
    }
  }, [purchaseId]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-4 sm:px-6">
        <motion.div
          className="text-center space-y-6 max-w-sm mx-auto"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
          />
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Loading Purchase Details
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Please wait while we retrieve your order information...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-3 xs:px-4 sm:px-6">
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-center max-w-xs xs:max-w-sm sm:max-w-md w-full border-2 border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4 leading-relaxed">
            We couldn't retrieve your purchase details. This might be a
            temporary issue.
          </p>
          <p className="text-red-500 dark:text-red-400 text-xs sm:text-sm font-medium mb-6 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            Error: {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl sm:rounded-2xl transition-colors duration-200 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
            <motion.a
              href="/"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.a>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-3 xs:px-4 sm:px-6">
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-center max-w-xs xs:max-w-sm sm:max-w-md w-full border-2 border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <TriangleAlert className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Purchase Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
            The purchase you're looking for could not be found. This might be an
            invalid link or the purchase may no longer exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href="/"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl sm:rounded-2xl transition-colors duration-200 text-sm sm:text-base"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </motion.a>
            <motion.a
              href="/purchases"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              View Purchases
            </motion.a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden border-2 border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          {/* Header Section */}
          <PurchaseConfirmationHeader purchaseNumber={purchase.id} />

          {/* Purchase Summary */}
          <motion.div
            className="px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <PurchaseSummary
              purchaseDate={new Date(purchase.createdAt).toLocaleDateString()}
              total={purchase.amount}
              purchaseNumber={purchase.id}
            />
          </motion.div>

          {/* Items Purchased */}
          <motion.div
            className="px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <ItemsPurchased items={purchase.items} />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="p-4 sm:p-6 lg:p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl sm:rounded-b-3xl"
            variants={itemVariants}
          >
            <ActionButtons orderId={purchase.id} />
          </motion.div>
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          className="mt-6 sm:mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-blue-50/50 dark:bg-blue-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 rounded-2xl p-4 sm:p-6 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Need Help With Your Purchase?
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm mb-4">
              Our support team is here to assist you with any questions about
              your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </motion.a>
              <motion.button
                whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => generateInvoice(purchase)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-700/80 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm font-medium rounded-xl transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PurchaseConfirmationPage;
