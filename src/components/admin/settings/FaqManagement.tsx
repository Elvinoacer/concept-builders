"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Design } from "@/generated/prisma";

const FaqManagement = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<{ designId: string; faqIndex: number } | null>(null);

  const fetchUnansweredFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/designs/unanswered-faqs");
      if (response.ok) {
        const data = await response.json();
        setDesigns(data);
      } else {
        throw new Error("Failed to fetch unanswered FAQs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnansweredFaqs();
  }, []);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFaq || !answer.trim()) {
      toast.error("Please select a question and enter an answer.");
      return;
    }

    try {
      const response = await fetch(
        `/api/designs/${selectedFaq.designId}/faq/${selectedFaq.faqIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer }),
        }
      );

      if (response.ok) {
        toast.success("Answer submitted successfully!");
        setAnswer("");
        setSelectedFaq(null);
        fetchUnansweredFaqs();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to submit answer.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting the answer.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-4">FAQ Management</h2>
      {designs.length === 0 ? (
        <p>No unanswered questions at the moment.</p>
      ) : (
        <div>
          {designs.map((design) => (
            <div key={design.id} className="mb-4">
              <h3 className="text-xl font-semibold">{design.name}</h3>
              <ul>
                {(design.faq as any[]).map((faq, index) => (
                  <li key={index} className="ml-4">
                    <p className="font-medium">{faq.question}</p>
                    {selectedFaq?.designId === design.id && selectedFaq?.faqIndex === index ? (
                      <form onSubmit={handleAnswerSubmit} className="flex items-center mt-2">
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="border rounded-md p-2 w-full"
                          placeholder="Enter your answer"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">
                          Submit
                        </button>
                      </form>
                    ) : (
                      <button onClick={() => {setSelectedFaq({ designId: design.id, faqIndex: index }); setAnswer("");}} className="text-blue-500">
                        Answer
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FaqManagement;
