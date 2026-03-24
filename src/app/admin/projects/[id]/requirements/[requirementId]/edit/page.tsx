"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { RequirementStatus } from "@/generated/prisma/browser";
import { Edit, ArrowLeft, Loader2 } from "lucide-react";

interface Requirement {
  id: string;
  description: string;
  status: RequirementStatus;
}

const EditRequirementPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const requirementId = params.requirementId as string;

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<RequirementStatus>(
    RequirementStatus.PENDING
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requirementLoading, setRequirementLoading] = useState(true);
  const [originalDescription, setOriginalDescription] = useState("");

  useEffect(() => {
    if (!projectId || !requirementId) return;

    const fetchRequirement = async () => {
      try {
        const response = await fetch(
          `/api/admin/projects/${projectId}/requirements/${requirementId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Requirement = await response.json();
        setDescription(data.description);
        setOriginalDescription(data.description);
        setStatus(data.status);
      } catch (err: any) {
        console.error("Error fetching requirement:", err);
        setError("Failed to load requirement data. Please try again.");
      } finally {
        setRequirementLoading(false);
      }
    };
    fetchRequirement();
  }, [projectId, requirementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/requirements/${requirementId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
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
      console.error("Error updating requirement:", err);
      setError(
        err.message || "Failed to update requirement. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = description !== originalDescription;

  if (requirementLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg text-center">
            Loading requirement data...
          </p>
        </div>
      </div>
    );
  }

  if (error && !requirementLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <p className="text-red-500 dark:text-red-400 text-lg sm:text-xl font-medium mb-4">
            Unable to Load Requirement
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 lg:p-8">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
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
            className="text-gray-900 dark:text-white font-bold leading-tight"
          >
            <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl block mb-2">
              Edit Requirement
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mt-3 text-sm xs:text-base sm:text-lg max-w-3xl"
          >
            Update the requirement details and status. Changes will be saved
            immediately upon submission.
          </motion.p>
        </header>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-4 xs:p-6 sm:p-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Description Field */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-900 dark:text-white sm:text-base"
                >
                  Requirement Description{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[140px] sm:min-h-[160px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe the project requirement in detail..."
                />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Be specific about deliverables, specifications, and acceptance
                  criteria.
                </p>
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
                  onChange={(e) =>
                    setStatus(e.target.value as RequirementStatus)
                  }
                  required
                >
                  {Object.values(RequirementStatus).map((s) => (
                    <option key={s} value={s} className="text-base py-2">
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current status of this requirement.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                {/* Cancel Button */}
                <motion.button
                  type="button"
                  onClick={() => router.back()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 min-h-[52px] sm:min-h-[56px] hover:bg-gray-300 dark:hover:bg-gray-600 order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-base sm:text-lg">Cancel</span>
                </motion.button>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: hasChanges ? 1.02 : 1 }}
                  whileTap={{ scale: hasChanges ? 0.98 : 1 }}
                  className={`flex-1 font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 min-h-[52px] sm:min-h-[56px] shadow-lg ${
                    hasChanges
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white hover:shadow-xl"
                      : "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                  } order-1 sm:order-2`}
                  disabled={loading || !hasChanges}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="text-base sm:text-lg">
                        Updating Requirement...
                      </span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-base sm:text-lg">
                        {hasChanges ? "Update Requirement" : "No Changes Made"}
                      </span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Change Indicator */}
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                >
                  <p className="text-blue-700 dark:text-blue-300 text-center text-sm sm:text-base font-medium">
                    ✨ You have unsaved changes
                  </p>
                </motion.div>
              )}

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

        {/* Additional Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 p-4 xs:p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-amber-900 dark:text-amber-100 mb-2">
            💡 Editing Tips
          </h3>
          <ul className="text-sm sm:text-base text-amber-800 dark:text-amber-200 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Update the status to reflect current progress</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Ensure the description clearly defines acceptance criteria
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Consider dependencies and impact on other requirements
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-6 sm:h-8 lg:h-12"></div>
      </div>
    </div>
  );
};

export default EditRequirementPage;
