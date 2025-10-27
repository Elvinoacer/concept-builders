"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface Feedback {
  id: string;
  message: string;
  rating: number | null;
  clientId: string;
  adminId: string | null;
}

const EditFeedbackPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const feedbackId = params.feedbackId as string;

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [clientId, setClientId] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch feedback data
  useEffect(() => {
    if (!projectId || !feedbackId) return;

    const fetchFeedback = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}/feedback/${feedbackId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Feedback = await response.json();
        setMessage(data.message);
        setRating(data.rating);
        setClientId(data.clientId);
        setAdminId(data.adminId);
      } catch (err: any) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load feedback data.");
      } finally {
        setFeedbackLoading(false);
      }
    };
    fetchFeedback();
  }, [projectId, feedbackId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/feedback/${feedbackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          rating,
          clientId,
          adminId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      router.push(`/admin/projects/${projectId}`);
    } catch (err: any) {
      console.error("Error updating feedback:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (usersLoading || feedbackLoading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
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
          Edit Feedback
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Modify the details of this feedback entry.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
          <select
            id="clientId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            {users.filter(u => u.id !== adminId).map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin (Optional)</label>
          <select
            id="adminId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={adminId || ""}
            onChange={(e) => setAdminId(e.target.value || null)}
          >
            <option value="">-- Select Admin --</option>
            {users.filter(u => u.id !== clientId).map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea
            id="message"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating (1-5, Optional)</label>
          <input
            type="number"
            id="rating"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={rating || ""}
            onChange={(e) => setRating(parseInt(e.target.value) || null)}
            min={1}
            max={5}
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? "Updating..." : <><Edit className="w-5 h-5" /><span>Update Feedback</span></>}
        </motion.button>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default EditFeedbackPage;
