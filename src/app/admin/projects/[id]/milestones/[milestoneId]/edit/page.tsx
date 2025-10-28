"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MilestoneStatus } from "@/generated/prisma";
import { Edit } from "lucide-react";
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
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading milestone data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Edit Milestone: {name}
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Modify the details of this milestone.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm max-w-2xl mx-auto"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Milestone Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="completedDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Completed Date
          </label>
          <input
            type="date"
            id="completedDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={completedDate || ""}
            onChange={(e) => setCompletedDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            "Updating..."
          ) : (
            <>
              <Edit className="w-5 h-5" />
              <span>Update Milestone</span>
            </>
          )}
        </motion.button>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default EditMilestonePage;
