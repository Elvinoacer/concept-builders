"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdminFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalFeedback, setTotalFeedback] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
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
        `Feedback ${!isFeatured ? "featured" : "unfeatured"} successfully`
      );
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error("Failed to update feedback");
    }
  };

  if (loading) {
    return <div>Loading feedback...</div>;
  }

  const totalPages = Math.ceil(totalFeedback / limit);

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Client Feedback
        </h2>
        <p className="text-gray-500 mt-0.5 md:mt-1 dark:text-gray-400">
          Manage and feature client feedback to display on the landing page.
        </p>
      </header>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border dark:border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Feedback
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {feedback.map((fb) => (
                  <tr key={fb.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {fb.user?.name || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {fb.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400">
                      {fb.feedback}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {fb.rating} / 5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {fb.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          handleFeatureToggle(fb.id, fb.isFeatured)
                        }
                        className={`px-4 py-2 rounded-md ${fb.isFeatured ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                      >
                        {fb.isFeatured ? "Unfeature" : "Feature"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(fb.id)}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalFeedback)} of {totalFeedback} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
