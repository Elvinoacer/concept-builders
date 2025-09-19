"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: "general", label: "General Feedback", icon: "chat" },
    { id: "bug", label: "Bug Report", icon: "bug_report" },
    { id: "feature", label: "Feature Request", icon: "lightbulb" },
    { id: "ui", label: "UI/UX Feedback", icon: "palette" },
    { id: "performance", label: "Performance", icon: "speed" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFeedback("");
    setRating(0);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">
                  check_circle
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
              Thank You for Your Feedback!
            </h1>
            <p className="text-gray-600 mb-8 dark:text-gray-400">
              Your feedback has been received and will help us improve our
              service. We appreciate you taking the time to share your thoughts
              with us.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors"
            >
              Submit Another Feedback
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            Share Your Feedback
          </h1>
          <p className="text-gray-600 mb-8 dark:text-gray-400">
            We'd love to hear your thoughts, suggestions, or concerns. Your
            feedback helps us improve our service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8 dark:bg-gray-800 dark:border dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 dark:text-white">
            How would you rate your experience?
          </h2>
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-all transform hover:scale-110 ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                {star <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border dark:border-gray-700"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    selectedCategory === category.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-400"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <span className="material-symbols-outlined mb-2">
                    {category.icon}
                  </span>
                  <span className="text-xs font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what's on your mind..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I'd like to receive updates about my feedback
              </span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Feedback"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFeedback("");
                setRating(0);
                setSelectedCategory("general");
              }}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 dark:bg-blue-900/20"
        >
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              info
            </span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2 dark:text-blue-200">
                What happens to your feedback?
              </h3>
              <p className="text-blue-700 text-sm dark:text-blue-300">
                Your feedback is reviewed by our team regularly. We use it to
                prioritize improvements and new features. While we can't respond
                to every submission, we read them all and appreciate your input.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;
