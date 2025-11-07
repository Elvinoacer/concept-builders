"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/feedback?page=${page}&limit=${limit}`
        );
        const data = await response.json();
        setFeedback(data.feedback || []);
        setTotalFeedback(data.totalFeedback || 0);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to fetch feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [page, limit]);

  const handleFeatureToggle = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}/feature`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (!response.ok) {
        throw new Error("Failed to update feedback");
      }

      setFeedback(
        feedback.map((fb) =>
          fb.id === id ? { ...fb, isFeatured: !isFeatured } : fb
        )
      );
      toast.success(
        `Feedback ${!isFeatured ? "featured" : "unfeatured"} successfully`,
        {
          icon: <Sparkles className="w-4 h-4" />,
        }
      );
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error("Failed to update feedback");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      setFeedback(feedback.filter((fb) => fb.id !== id));
      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              i < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating}/5
        </span>
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      bug: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      feature:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      improvement:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Loading feedback...
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalFeedback / limit);

  return (
    <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              Client Feedback
            </h1>
            <p className="text-gray-500 mt-2 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
              Manage and feature client feedback to display on the landing page.
              Showcase the best testimonials to build trust with visitors.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 shrink-0 py-2.5 sm:py-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden xs:inline">Filter</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {totalFeedback}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                Total Feedback
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Star className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {feedback.filter((fb) => fb.isFeatured).length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                Featured
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feedback Table */}
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    User & Feedback
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden lg:table-cell">
                    Rating
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                <AnimatePresence>
                  {feedback.map((fb, index) => (
                    <motion.tr
                      key={fb.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        fb.isFeatured
                          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                              {fb.user?.name?.charAt(0) || "A"}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {fb.user?.name || "Anonymous"}
                              </h4>
                              {fb.isFeatured && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shrink-0">
                                  <Sparkles className="w-3 h-3" />
                                  Featured
                                </span>
                              )}
                            </div>
                            {fb.user?.email && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">
                                  {fb.user.email}
                                </span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 break-words">
                              {fb.feedback}
                            </p>

                            {/* Mobile metadata */}
                            <div className="flex flex-wrap items-center gap-2 mt-2 lg:hidden">
                              {renderStars(fb.rating)}
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(fb.category)}`}
                              >
                                {fb.category}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 md:hidden">
                                <Calendar className="w-3 h-3" />
                                {new Date(fb.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                        {renderStars(fb.rating)}
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                        <span
                          className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium ${getCategoryColor(fb.category)}`}
                        >
                          {fb.category}
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() =>
                              handleFeatureToggle(fb.id, fb.isFeatured)
                            }
                            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                              fb.isFeatured
                                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25"
                                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                            } hover:shadow-xl hover:scale-105 active:scale-95`}
                            title={fb.isFeatured ? "Unfeature" : "Feature"}
                          >
                            {fb.isFeatured ? (
                              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(fb.id)}
                            className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                            title="Delete feedback"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex flex-col xs:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center xs:text-left">
                Showing{" "}
                <span className="font-semibold">{(page - 1) * limit + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(page * limit, totalFeedback)}
                </span>{" "}
                of <span className="font-semibold">{totalFeedback}</span>{" "}
                entries
              </p>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-2 sm:px-3"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          page === pageNumber
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="px-1 sm:px-2 text-gray-500 text-xs">
                      ...
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-2 sm:px-3"
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
