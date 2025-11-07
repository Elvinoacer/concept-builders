"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MilestoneStatus } from "@/generated/prisma";
import { Edit, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  dueDate: string;
  completedDate: string | null;
  status: MilestoneStatus;
}

const EditMilestonePage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const milestoneId = params.milestoneId as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completedDate, setCompletedDate] = useState<string | null>(null);
  const [status, setStatus] = useState<MilestoneStatus>(
    MilestoneStatus.PENDING
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [milestoneLoading, setMilestoneLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !milestoneId) return;

    const fetchMilestone = async () => {
      try {
        const response = await fetch(
          `/api/admin/projects/${projectId}/milestones/${milestoneId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Milestone = await response.json();
        setName(data.name);
        setDescription(data.description || "");
        setDueDate(format(new Date(data.dueDate), "yyyy-MM-dd"));
        setCompletedDate(
          data.completedDate
            ? format(new Date(data.completedDate), "yyyy-MM-dd")
            : null
        );
        setStatus(data.status);
      } catch (err: any) {
        console.error("Error fetching milestone:", err);
        setError("Failed to load milestone data.");
      } finally {
        setMilestoneLoading(false);
      }
    };
    fetchMilestone();
  }, [projectId, milestoneId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/milestones/${milestoneId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            dueDate,
            completedDate,
            status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      router.push(`/admin/projects/${projectId}`);
    } catch (err: any) {
      console.error("Error updating milestone:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (milestoneLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg text-center">
            Loading milestone data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <p className="text-red-500 dark:text-red-400 text-lg sm:text-xl font-medium mb-4">
            Error Loading Milestone
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
            {error}
          </p>
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 lg:p-8">
      {/* Back Button - Mobile First */}
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 sm:mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base font-medium">
            Back to Project
          </span>
        </button>

        {/* Header Section */}
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-900 dark:text-white font-bold leading-tight break-words"
          >
            <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl block mb-2">
              Edit Milestone
            </span>
            <span className="text-lg xs:text-xl sm:text-2xl text-blue-600 dark:text-cyan-400 block font-semibold">
              {name}
            </span>
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm xs:text-base sm:text-lg max-w-3xl">
            Modify the details and status of this project milestone. All changes
            are saved immediately upon submission.
          </p>
        </header>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-4 xs:p-6 sm:p-8">
            {/* Form Grid Layout */}
            <div className="space-y-6 sm:space-y-8">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-900 dark:text-white sm:text-base"
                >
                  Milestone Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[48px] sm:min-h-[52px]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter milestone name"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-900 dark:text-white sm:text-base"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[120px] sm:min-h-[140px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the milestone objectives and deliverables..."
                />
              </div>

              {/* Date Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Due Date */}
                <div className="space-y-2">
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-semibold text-gray-900 dark:text-white sm:text-base"
                  >
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[48px] sm:min-h-[52px]"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>

                {/* Completed Date */}
                <div className="space-y-2">
                  <label
                    htmlFor="completedDate"
                    className="block text-sm font-semibold text-gray-900 dark:text-white sm:text-base"
                  >
                    Completed Date
                  </label>
                  <input
                    type="date"
                    id="completedDate"
                    className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[48px] sm:min-h-[52px]"
                    value={completedDate || ""}
                    onChange={(e) => setCompletedDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-gray-900 dark:text-white sm:text-base"
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[48px] sm:min-h-[52px] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%204%205%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right-4 bg-center dark:bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%204%205%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22/%3E%3C/svg%3E')]"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                  required
                >
                  {Object.values(MilestoneStatus).map((s) => (
                    <option key={s} value={s} className="text-base">
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 min-h-[56px] sm:min-h-[60px] text-lg sm:text-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    <span>Updating Milestone...</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Update Milestone</span>
                  </>
                )}
              </motion.button>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <p className="text-red-700 dark:text-red-400 text-center text-sm sm:text-base font-medium">
                    {error}
                  </p>
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Responsive Spacing */}
        <div className="h-6 sm:h-8 lg:h-12"></div>
      </div>
    </div>
  );
};

export default EditMilestonePage;
