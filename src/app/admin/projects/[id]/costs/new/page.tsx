"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlusCircle,
  ArrowLeft,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

const CreateCostPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dateIncurred, setDateIncurred] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Please enter a valid amount greater than 0");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/costs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          amount: amountValue,
          dateIncurred,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Success animation before redirect
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/admin/projects/${projectId}`);
    } catch (err: any) {
      console.error("Error creating cost:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group self-start"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent break-words">
              Add New Cost
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="break-words">
                Record a new cost associated with this project
              </span>
            </p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8"
        >
          {/* Description Field */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Description *</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Enter cost description (e.g., Materials, Labor, Software License, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Amount and Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Amount Field */}
            <div>
              <label
                htmlFor="amount"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span>Amount *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  id="amount"
                  className="w-full pl-8 pr-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter amount in USD
              </p>
            </div>

            {/* Date Field */}
            <div>
              <label
                htmlFor="dateIncurred"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Date Incurred *</span>
              </label>
              <input
                type="date"
                id="dateIncurred"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={dateIncurred}
                onChange={(e) => setDateIncurred(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 mb-4 sm:mb-6"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <p className="text-sm break-words">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                <span>Adding Cost...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>Add Cost Entry</span>
              </>
            )}
          </motion.button>

          {/* Quick Amount Buttons */}
          <div className="mt-4 sm:mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
              Quick amount options:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[50, 100, 250, 500, 1000].map((quickAmount) => (
                <motion.button
                  key={quickAmount}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  ${quickAmount}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.form>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                Cost Tracking Tips
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Include detailed descriptions for better tracking</li>
                <li>• Record costs as soon as they occur</li>
                <li>• Use consistent categories for similar expenses</li>
                <li>• Attach receipts when possible for documentation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Add missing icon components
const AlertCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const Info = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// Add AnimatePresence import
const AnimatePresence = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export default CreateCostPage;
