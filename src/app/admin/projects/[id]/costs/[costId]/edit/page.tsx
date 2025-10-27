"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { format } from "date-fns";

interface Cost {
  id: string;
  description: string;
  amount: number;
  dateIncurred: string;
}

const EditCostPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const costId = params.costId as string;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [dateIncurred, setDateIncurred] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costLoading, setCostLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !costId) return;

    const fetchCost = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}/costs/${costId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Cost = await response.json();
        setDescription(data.description);
        setAmount(data.amount);
        setDateIncurred(format(new Date(data.dateIncurred), "yyyy-MM-dd"));
      } catch (err: any) {
        console.error("Error fetching cost:", err);
        setError("Failed to load cost data.");
      } finally {
        setCostLoading(false);
      }
    };
    fetchCost();
  }, [projectId, costId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/costs/${costId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          amount,
          dateIncurred,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      router.push(`/admin/projects/${projectId}`);
    } catch (err: any) {
      console.error("Error updating cost:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (costLoading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading cost data...</p>
      </div>
    );
  };

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
          Edit Cost Entry
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Modify the details of this cost entry.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            type="number"
            id="amount"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            step="0.01"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="dateIncurred" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Incurred</label>
          <input
            type="date"
            id="dateIncurred"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={dateIncurred}
            onChange={(e) => setDateIncurred(e.target.value)}
            required
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? "Updating..." : <><Edit className="w-5 h-5" /><span>Update Cost</span></>}
        </motion.button>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default EditCostPage;
