"use client";

import { useState, useEffect } from "react";
import { Feedback } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import { Star, Calendar, Folder, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyFeedbackPage = () => {
  const { data: session, status } = useSession();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">(
    "newest"
  );

  // Extract unique categories for filtering
  const categories = [
    "all",
    ...new Set(feedbackList.map((item) => item.category)),
  ];

  // Filter and sort feedback
  const filteredAndSortedFeedback = feedbackList
    .filter(
      (item) => selectedCategory === "all" || item.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  useEffect(() => {
    if (status === "authenticated") {
      const fetchFeedback = async () => {
        try {
          const response = await fetch("/api/feedback");
          if (!response.ok) {
            throw new Error(`Failed to load feedback: ${response.status}`);
          }
          const data: Feedback[] = await response.json();
          setFeedbackList(data);
        } catch (err: any) {
          console.error("Error fetching feedback:", err);
          setError("Unable to load your feedback. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchFeedback();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to view your feedback.");
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-8">
          {/* Skeleton Header */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Feedback
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                My Feedback
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
                Review all the feedback you've submitted
              </p>
            </div>

            {/* Stats Summary */}
            {feedbackList.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Feedback
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {feedbackList.length}
                </p>
              </div>
            )}
          </div>

          {/* Filters */}
          {feedbackList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
            >
              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Feedback Grid */}
        <AnimatePresence>
          {filteredAndSortedFeedback.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedCategory === "all"
                  ? "No Feedback Yet"
                  : "No Matching Feedback"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {selectedCategory === "all"
                  ? "You haven't submitted any feedback yet. Your feedback helps us improve!"
                  : `No feedback found in the ${selectedCategory} category.`}
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredAndSortedFeedback.map((feedbackItem, index) => (
                <motion.div
                  key={feedbackItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < feedbackItem.rating
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-2 py-1 rounded-full">
                      {feedbackItem.rating}/5
                    </span>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                    {feedbackItem.feedback}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        <span className="capitalize">
                          {feedbackItem.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(
                            feedbackItem.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyFeedbackPage;
