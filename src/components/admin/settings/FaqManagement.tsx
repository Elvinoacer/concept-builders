"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Design } from "@/generated/prisma";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Loader2,
  MessageCircle,
  Search,
  Send,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FaqManagement = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<{
    designId: string;
    faqIndex: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDesigns, setExpandedDesigns] = useState<Set<string>>(
    new Set()
  );
  const [submitting, setSubmitting] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const fetchUnansweredFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/designs/unanswered-faqs");
      if (response.ok) {
        const data = await response.json();
        setDesigns(data);
        setFilteredDesigns(data);
      } else {
        throw new Error("Failed to fetch unanswered FAQs");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnansweredFaqs();
  }, []);

  // Filter designs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDesigns(designs);
      return;
    }

    const filtered = designs.filter(
      (design) =>
        design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (design.faq as any[]).some((faq: any) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredDesigns(filtered);
  }, [searchTerm, designs]);

  const toggleDesignExpansion = (designId: string) => {
    const newExpanded = new Set(expandedDesigns);
    if (newExpanded.has(designId)) {
      newExpanded.delete(designId);
    } else {
      newExpanded.add(designId);
    }
    setExpandedDesigns(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set(filteredDesigns.map((design) => design.id));
    setExpandedDesigns(allIds);
  };

  const collapseAll = () => {
    setExpandedDesigns(new Set());
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFaq || !answer.trim()) {
      toast.error("Please enter an answer before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/designs/${selectedFaq.designId}/faq/${selectedFaq.faqIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: answer.trim() }),
        }
      );

      if (response.ok) {
        toast.success("Answer submitted successfully!");
        setAnswer("");
        setSelectedFaq(null);
        setShowAnswerModal(false);
        fetchUnansweredFaqs();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit answer");
      }
    } catch (err: any) {
      toast.error(
        err.message || "An error occurred while submitting the answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openAnswerModal = (
    designId: string,
    faqIndex: number,
    question: string
  ) => {
    setSelectedFaq({ designId, faqIndex });
    setAnswer("");
    setShowAnswerModal(true);
  };

  const closeAnswerModal = () => {
    setShowAnswerModal(false);
    setSelectedFaq(null);
    setAnswer("");
  };

  // Calculate total unanswered questions
  const totalUnanswered = designs.reduce(
    (total, design) => total + (design.faq as any[]).length,
    0
  );

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(2)].map((_, faqIndex) => (
                <div
                  key={faqIndex}
                  className="space-y-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        All Caught Up!
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        There are no unanswered questions at the moment. Great job keeping up
        with customer inquiries!
      </p>
      <Button onClick={fetchUnansweredFaqs} variant="outline">
        Refresh
      </Button>
    </motion.div>
  );

  // Error State
  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8 px-4"
    >
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Unable to Load FAQs
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
      <Button onClick={fetchUnansweredFaqs}>Try Again</Button>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              FAQ Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage unanswered customer questions
            </p>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              FAQ Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage unanswered customer questions
            </p>
          </div>
        </div>
        <ErrorState />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            FAQ Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage unanswered customer questions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {totalUnanswered} unanswered
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchUnansweredFaqs}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search designs or questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 h-11"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Expand/Collapse Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="flex-1 sm:flex-none"
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="flex-1 sm:flex-none"
              >
                Collapse All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {searchTerm && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Found {filteredDesigns.length} design
          {filteredDesigns.length !== 1 ? "s" : ""} matching "{searchTerm}"
        </div>
      )}

      {/* Designs List */}
      {filteredDesigns.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredDesigns.map((design) => {
            const faqs = design.faq as any[];
            const isExpanded = expandedDesigns.has(design.id);

            return (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader
                    className="pb-3 cursor-pointer"
                    onClick={() => toggleDesignExpansion(design.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg truncate">
                            {design.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {faqs.length} question
                              {faqs.length !== 1 ? "s" : ""}
                            </Badge>
                            {design.createdAt && (
                              <span className="text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(
                                  design.createdAt
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDesignExpansion(design.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0 space-y-3">
                          {faqs.map((faq, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <HelpCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    {faq.question}
                                  </p>
                                  <div className="flex flex-col xs:flex-row xs:items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    {faq.askedBy && (
                                      <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        Asked by: {faq.askedBy}
                                      </span>
                                    )}
                                    {faq.createdAt && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(
                                          faq.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  onClick={() =>
                                    openAnswerModal(
                                      design.id,
                                      index,
                                      faq.question
                                    )
                                  }
                                  size="sm"
                                  className="flex-shrink-0"
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Answer
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Answer Modal */}
      <AnimatePresence>
        {showAnswerModal && selectedFaq && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeAnswerModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Answer Question
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeAnswerModal}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-6">
                  {/* Question */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Question
                    </label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-900 dark:text-white">
                        {
                          designs.find((d) => d.id === selectedFaq.designId)
                            ?.faq?.[selectedFaq.faqIndex]?.question
                        }
                      </p>
                    </div>
                  </div>

                  {/* Answer Form */}
                  <form onSubmit={handleAnswerSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="answer"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                      >
                        Your Answer *
                      </label>
                      <Textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter your detailed answer here..."
                        rows={6}
                        className="resize-vertical min-h-[120px] text-base"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Provide a clear and helpful answer to the customer's
                        question.
                      </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeAnswerModal}
                        className="flex-1"
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!answer.trim() || submitting}
                        className="flex-1"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FaqManagement;
