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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-6 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-card border-2 border-cb-border shadow-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div>
          <label
            htmlFor="question"
            className="block text-xs sm:text-sm font-bold text-gold uppercase tracking-widest mb-3"
          >
            Ask a Architectural Question
          </label>
          <div className="mt-1">
            <textarea
              id="question"
              name="question"
              rows={4}
              className="block w-full rounded-xl border-2 border-cb-border shadow-inner focus:border-gold focus:ring-gold bg-surface text-cream text-sm sm:text-base p-4 sm:p-5 resize-y min-h-[120px] sm:min-h-[150px] placeholder:text-muted transition-all duration-300 font-medium"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="How can we help you with this specific design? Ask about modifications, materials, or structural details..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-gold py-3 px-8 sm:py-4 sm:px-10 text-sm sm:text-base font-black text-ink shadow-2xl shadow-gold/20 hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full mr-3"
                />
                Processing Inquiry...
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
