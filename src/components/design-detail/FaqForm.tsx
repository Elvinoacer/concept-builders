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
      className="mt-6 sm:mt-8"
    >
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label
            htmlFor="question"
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Ask a Question
          </label>
          <div className="mt-1">
            <textarea
              id="question"
              name="question"
              rows={3}
              className="block w-full rounded-lg sm:rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-xs sm:text-sm p-2 sm:p-3 resize-y min-h-[80px] sm:min-h-[100px]"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
            />
          </div>
        </div>
        <div>
          <motion.button
            type="submit"
            className="inline-flex justify-center rounded-lg sm:rounded-md border border-transparent bg-indigo-600 py-2 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] sm:min-h-[40px]"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Submitting...
              </span>
            ) : (
              "Submit Question"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FaqForm;
