"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Bug,
  Lightbulb,
  Palette,
  Gauge,
  CheckCircle2,
  Info,
  Star,
  Send,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const FeedbackPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userFeedback, setUserFeedback] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const router = useRouter();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const categories = [
    {
      id: "general",
      label: "General",
      icon: MessageCircle,
      fullLabel: "General Feedback",
    },
    { id: "bug", label: "Bug", icon: Bug, fullLabel: "Bug Report" },
    {
      id: "feature",
      label: "Feature",
      icon: Lightbulb,
      fullLabel: "Feature Request",
    },
    { id: "ui", label: "UI/UX", icon: Palette, fullLabel: "UI/UX Feedback" },
    {
      id: "performance",
      label: "Performance",
      icon: Gauge,
      fullLabel: "Performance",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          category: selectedCategory,
          feedback: feedback.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const newFeedback = await response.json();
      setUserFeedback((prev) => [newFeedback, ...prev]);
      setIsSubmitted(true);
      setFeedback("");
      setRating(0);
      setHoverRating(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      setUserFeedback((prev) => prev.filter((fb) => fb.id !== feedbackId));
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const starVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-3 xs:px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 dark:text-white">
              Thank You!
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              Your feedback has been received and will help us improve our
              service. We appreciate you taking the time to share your thoughts
              with us.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => setIsSubmitted(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                Submit More Feedback
              </motion.button>

              <motion.button
                onClick={() => router.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-none px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base"
              >
                Go Back
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          className="mb-6 sm:mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>

            <div>
              <motion.h1
                variants={itemVariants}
                className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Share Your Feedback
              </motion.h1>

              <motion.p
                variants={itemVariants}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400 text-sm sm:text-base"
              >
                We'd love to hear your thoughts, suggestions, or concerns.
              </motion.p>
            </div>
          </div>
        </motion.header>

        <div className="space-y-6 sm:space-y-8">
          {/* Rating Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 shadow-sm"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
              How would you rate your experience?
            </h2>

            <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  variants={starVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-2xl sm:text-3xl transition-all duration-200 ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 scale-110"
                      : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                  }`}
                >
                  <Star
                    className={
                      star <= (hoverRating || rating) ? "fill-current" : ""
                    }
                  />
                </motion.button>
              ))}
            </div>

            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-gray-600 dark:text-gray-400"
              >
                {rating === 5 && "Excellent! We're thrilled to hear that! 🎉"}
                {rating === 4 && "Great! Thanks for the positive feedback! 👍"}
                {rating === 3 && "Good! We appreciate your honest feedback! 👌"}
                {rating === 2 && "Fair. We'd love to know how we can improve."}
                {rating === 1 &&
                  "We're sorry to hear that. Please tell us more."}
              </motion.p>
            )}
          </motion.div>

          {/* Feedback Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 shadow-sm"
          >
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category
              </label>

              <div
                className={`grid gap-2 ${
                  isMobile
                    ? "grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
                }`}
              >
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      type="button"
                      variants={itemVariants}
                      onClick={() => setSelectedCategory(category.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedCategory === category.id
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400 shadow-md"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2" />
                      <span className="text-xs font-medium text-center leading-tight">
                        {isMobile ? category.label : category.fullLabel}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Your Feedback
              </label>

              <motion.textarea
                variants={itemVariants}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what's on your mind... What did you like? What can we improve?"
                rows={isMobile ? 4 : 6}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 resize-none text-sm sm:text-base"
                required
              />

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {feedback.length}/1000 characters
                </span>
                {feedback.length > 800 && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {1000 - feedback.length} characters left
                  </span>
                )}
              </div>
            </div>

            {/* Consent Checkbox */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  I'd like to receive updates about my feedback and other
                  product improvements
                </span>
              </label>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting || !feedback.trim() || rating === 0}
                whileHover={{
                  scale:
                    !isSubmitting && feedback.trim() && rating > 0 ? 1.02 : 1,
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-md text-sm sm:text-base flex-1"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  setFeedback("");
                  setRating(0);
                  setHoverRating(0);
                  setSelectedCategory("general");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base"
              >
                Clear
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Information Card */}
          <motion.div
            variants={itemVariants}
            transition={{ delay: 0.3 }}
            className="bg-blue-50/50 dark:bg-blue-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 text-sm sm:text-base">
                  What happens to your feedback?
                </h3>
                <p className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm leading-relaxed">
                  Your feedback is reviewed by our team regularly. We use it to
                  prioritize improvements and new features. While we can't
                  respond to every submission, we read them all and appreciate
                  your input.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Previous Feedback */}
          <AnimatePresence>
            {userFeedback.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 shadow-sm"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Your Previous Feedback
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {userFeedback.slice(0, isMobile ? 3 : 5).map((fb) => (
                    <motion.div
                      key={fb.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-gray-50/50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4 border border-gray-200/50 dark:border-gray-600/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full capitalize">
                            {fb.category.replace("_", " ")}
                          </span>
                          <div className="flex text-yellow-400 text-sm">
                            {"★".repeat(fb.rating)}
                            {"☆".repeat(5 - fb.rating)}
                          </div>
                        </div>

                        <motion.button
                          onClick={() => handleDeleteFeedback(fb.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                        {fb.feedback}
                      </p>

                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(fb.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {userFeedback.length > (isMobile ? 3 : 5) && (
                  <div className="mt-4 text-center">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                      Show all {userFeedback.length} feedback items
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
