"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  ArrowLeft,
  User,
  MessageCircle,
  Star,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

const CreateFeedbackPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [clientId, setClientId] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
        if (data.length > 0) {
          setClientId(data[0].id);
        }
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!message.trim()) {
      setError("Please enter a feedback message.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            rating,
            clientId,
            adminId,
          }),
        }
      );

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
      console.error("Error creating feedback:", err);
      setError(err.message || "Failed to create feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating === rating ? null : selectedRating);
  };

  if (usersLoading) {
    return (
      <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 text-sm sm:text-base mb-4 break-words">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              Add New Feedback
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="break-words">
                Provide valuable feedback for this project
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
          {/* Client Selection */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="clientId"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span>Client *</span>
            </label>
            <select
              id="clientId"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%204%205%22><path%20fill%3D%22%236B7280%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22%2F><%2Fsvg>')] bg-no-repeat bg-right-3 bg-center bg-size-3 sm:bg-right-4 sm:bg-size-4"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              {users
                .filter((u) => u.id !== adminId)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          {/* Admin Selection */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="adminId"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span>Admin (Optional)</span>
            </label>
            <select
              id="adminId"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%204%205%22><path%20fill%3D%22%236B7280%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22%2F><%2Fsvg>')] bg-no-repeat bg-right-3 bg-center bg-size-3 sm:bg-right-4 sm:bg-size-4"
              value={adminId || ""}
              onChange={(e) => setAdminId(e.target.value || null)}
            >
              <option value="">-- Select Admin --</option>
              {users
                .filter((u) => u.id !== clientId)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          {/* Message Field */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="message"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span>Message *</span>
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Enter your feedback message... (What went well? What could be improved?)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Provide constructive feedback about the project
            </p>
          </div>

          {/* Rating Field */}
          <div className="mb-4 sm:mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
              <Star className="w-4 h-4 flex-shrink-0" />
              <span>Rating (Optional)</span>
            </label>

            {/* Star Rating Input */}
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-colors duration-200"
                >
                  <Star
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${
                      star <= (hoverRating || rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    } transition-colors duration-200`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Numeric Rating Input */}
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="rating"
                className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={rating || ""}
                onChange={(e) => setRating(parseInt(e.target.value) || null)}
                min={1}
                max={5}
                placeholder="1-5"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Or enter a number 1-5
              </span>
            </div>

            {rating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400"
              >
                <Star className="w-4 h-4 fill-yellow-400" />
                <span>Rating: {rating}/5</span>
              </motion.div>
            )}
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
                <span>Adding Feedback...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>Add Feedback</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                Feedback Best Practices
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Be specific and provide examples</li>
                <li>• Focus on both positives and areas for improvement</li>
                <li>• Use constructive language</li>
                <li>• Consider the project goals and objectives</li>
                <li>• Ratings help quantify satisfaction levels</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateFeedbackPage;
