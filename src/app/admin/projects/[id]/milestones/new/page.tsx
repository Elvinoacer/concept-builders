"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MilestoneStatus } from "@/generated/prisma";
import {
  PlusCircle,
  ArrowLeft,
  Target,
  Calendar,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const CreateMilestonePage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<MilestoneStatus>(
    MilestoneStatus.PENDING
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name.trim()) {
      setError("Please enter a milestone name.");
      setLoading(false);
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            dueDate,
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

      // Success animation before redirect
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/admin/projects/${projectId}`);
    } catch (err: any) {
      console.error("Error creating milestone:", err);
      setError(err.message || "Failed to create milestone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick due date options
  const quickDueDates = [
    { label: "Tomorrow", days: 1 },
    { label: "Next Week", days: 7 },
    { label: "2 Weeks", days: 14 },
    { label: "1 Month", days: 30 },
  ];

  const setQuickDueDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDueDate(date.toISOString().split("T")[0]);
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
              Create New Milestone
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="break-words">
                Add a new milestone for this project
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
          {/* Milestone Name */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              <Target className="w-4 h-4 flex-shrink-0" />
              <span>Milestone Name *</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter milestone name (e.g., Design Phase, Development Complete, etc.)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Description</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe what this milestone entails, key deliverables, or success criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optional: Provide details about what this milestone represents
            </p>
          </div>

          {/* Due Date and Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Due Date *</span>
              </label>
              <input
                type="date"
                id="dueDate"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />

              {/* Quick Due Date Buttons */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Quick select:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickDueDates.map((option) => (
                    <motion.button
                      key={option.label}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuickDueDate(option.days)}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>Status *</span>
              </label>
              <select
                id="status"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%204%205%22><path%20fill%3D%22%236B7280%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22%2F><%2Fsvg>')] bg-no-repeat bg-right-3 bg-center bg-size-3 sm:bg-right-4 sm:bg-size-4"
                value={status}
                onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                required
              >
                {Object.values(MilestoneStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              {/* Status Description */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {status === MilestoneStatus.PENDING &&
                    "Milestone is planned but not started"}
                  {status === MilestoneStatus.IN_PROGRESS &&
                    "Milestone work has begun"}
                  {status === MilestoneStatus.COMPLETED &&
                    "Milestone has been completed"}
                  {status === MilestoneStatus.OVERDUE &&
                    "Milestone is past due date"}
                </p>
              </div>
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
                <span>Creating Milestone...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>Create Milestone</span>
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
                Milestone Best Practices
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Set realistic due dates based on project complexity</li>
                <li>• Use clear, descriptive names for each milestone</li>
                <li>
                  • Break large projects into smaller, manageable milestones
                </li>
                <li>• Include specific deliverables in the description</li>
                <li>• Update status regularly to track progress accurately</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateMilestonePage;
