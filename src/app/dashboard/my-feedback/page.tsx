"use client";

import { useState, useEffect } from "react";
import { Feedback } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

const MyFeedbackPage = () => {
  const { data: session, status } = useSession();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchFeedback = async () => {
        try {
          const response = await fetch("/api/feedback");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: Feedback[] = await response.json();
          setFeedbackList(data);
        } catch (err: any) {
          console.error("Error fetching feedback:", err);
          setError("Failed to load your feedback.");
        } finally {
          setLoading(false);
        }
      };
      fetchFeedback();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("You must be logged in to view your feedback.");
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading your feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          My Feedback
        </h1>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          View all the feedback you have submitted.
        </p>
      </header>

      {feedbackList.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You haven't submitted any feedback yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbackList.map((feedbackItem) => (
            <div
              key={feedbackItem.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < feedbackItem.rating ? "fill-current" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                  {feedbackItem.rating} Stars
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-lg mb-4">
                {feedbackItem.feedback}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Category: {feedbackItem.category}</p>
                <p>Submitted on: {new Date(feedbackItem.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFeedbackPage;
