"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface FaqFormProps {
  designId: string;
  onFaqSubmitted: () => void;
}

const FaqForm: React.FC<FaqFormProps> = ({ designId, onFaqSubmitted }) => {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/designs/${designId}/faq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        toast.success("Your question has been submitted!");
        setQuestion("");
        onFaqSubmitted();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to submit your question.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting your question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Ask a Question
          </label>
          <div className="mt-1">
            <textarea
              id="question"
              name="question"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FaqForm;
