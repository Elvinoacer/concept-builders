"use client";
import {
  InvoiceStatus,
  InvoiceType,
  MilestoneStatus,
  ProjectStatus,
  RequirementStatus,
} from "@/generated/prisma";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  Download,
  Edit,
  FileText,
  ListChecks,
  MessageCircle,
  PlusCircle,
  Receipt,
  Target,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface ProjectMilestone {
  id: string;
  name: string;
  description: string | null;
  dueDate: string;
  completedDate: string | null;
  status: MilestoneStatus;
}

interface ProjectRequirement {
  id: string;
  description: string;
  status: RequirementStatus;
}

interface ProjectCost {
  id: string;
  description: string;
  amount: number;
  dateIncurred: string;
}

interface ProjectFeedback {
  id: string;
  message: string;
  rating: number | null;
  createdAt: string;
  client: User;
  admin: User | null;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: InvoiceStatus;
  type: InvoiceType;
  documentUrl: string | null;
  invoiceItems: InvoiceItem[];
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  progress: number;
  status: ProjectStatus;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  completionRemarks: string | null;
  declaration: boolean;
  totalCost: number;
  milestones: ProjectMilestone[];
  requirements: ProjectRequirement[];
  costs: ProjectCost[];
  feedback: ProjectFeedback[];
  invoices: Invoice[];
}

const AdminProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/projects/specf/${projectId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Project = await response.json();
      setProject(data);
    } catch (err: any) {
      console.error("Error fetching project:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  const getStatusColorClass = (
    status: ProjectStatus | MilestoneStatus | RequirementStatus | InvoiceStatus
  ) => {
    switch (status) {
      case ProjectStatus.PLANNING:
      case MilestoneStatus.PENDING:
      case RequirementStatus.PENDING:
      case InvoiceStatus.PENDING:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case ProjectStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case ProjectStatus.COMPLETED:
      case MilestoneStatus.COMPLETED:
      case RequirementStatus.MET:
      case InvoiceStatus.PAID:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case ProjectStatus.ON_HOLD:
      case MilestoneStatus.OVERDUE:
      case InvoiceStatus.OVERDUE:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case ProjectStatus.CANCELLED:
      case RequirementStatus.NOT_MET:
      case InvoiceStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      router.push("/admin/projects");
    } catch (err: any) {
      console.error("Error deleting project:", err);
      setError(err.message);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/milestones/${milestoneId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete milestone");
      fetchProject();
    } catch (err: any) {
      console.error("Error deleting milestone:", err);
      setError(err.message);
    }
  };

  const handleDeleteRequirement = async (requirementId: string) => {
    if (!confirm("Are you sure you want to delete this requirement?")) return;
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/requirements/${requirementId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete requirement");
      fetchProject();
    } catch (err: any) {
      console.error("Error deleting requirement:", err);
      setError(err.message);
    }
  };

  const handleDeleteCost = async (costId: string) => {
    if (!confirm("Are you sure you want to delete this cost entry?")) return;
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/costs/${costId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete cost");
      fetchProject();
    } catch (err: any) {
      console.error("Error deleting cost:", err);
      setError(err.message);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/feedback/${feedbackId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete feedback");
      fetchProject();
    } catch (err: any) {
      console.error("Error deleting feedback:", err);
      setError(err.message);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/invoices/${invoiceId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete invoice");
      fetchProject();
    } catch (err: any) {
      console.error("Error deleting invoice:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 text-sm sm:text-base mb-4">
            Error: {error}
          </p>
          <button
            onClick={() => fetchProject()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Project not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8">
      {/* Header with Back Button */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group self-start"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white break-words leading-tight">
              {project.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="break-words">
                Client: {project.user.name} ({project.user.email})
              </span>
            </p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Project Overview - Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Project Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Project Overview
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {project.description && (
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}

              {project.imageUrl && (
                <div className="relative">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}

              {/* Status and Progress */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(project.status)}`}
                    >
                      {project.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {project.progress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Cost
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ${project.totalCost.toFixed(2)}
                    </span>
                  </div>

                  {project.declaration && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Status
                      </span>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {project.completionRemarks && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Completion Remarks:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.completionRemarks}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link
                  href={`/admin/projects/${projectId}/edit`}
                  className="flex-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Project</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteProject(projectId)}
                  className="flex-1 bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Project</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - Related Entities */}
        <div className="space-y-4 sm:space-y-6">
          {/* Milestones Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Milestones
                </h3>
              </div>
              <Link href={`/admin/projects/${projectId}/milestones/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 sm:gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden xs:inline">Add</span>
                </motion.button>
              </Link>
            </div>

            {project.milestones.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No milestones yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {project.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm mb-1 break-words">
                          {milestone.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Due:{" "}
                          {format(new Date(milestone.dueDate), "MMM dd, yyyy")}
                        </p>
                        {milestone.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(milestone.status)}`}
                        >
                          {milestone.status.charAt(0)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/projects/${projectId}/milestones/${milestone.id}/edit`}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Requirements Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Requirements
                </h3>
              </div>
              <Link href={`/admin/projects/${projectId}/requirements/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 sm:gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden xs:inline">Add</span>
                </motion.button>
              </Link>
            </div>

            {project.requirements.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No requirements yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {project.requirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white text-sm break-words">
                          {requirement.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(requirement.status)}`}
                        >
                          {requirement.status.charAt(0)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/projects/${projectId}/requirements/${requirement.id}/edit`}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleDeleteRequirement(requirement.id)
                            }
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Costs Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Costs
                </h3>
              </div>
              <Link href={`/admin/projects/${projectId}/costs/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 sm:gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden xs:inline">Add</span>
                </motion.button>
              </Link>
            </div>

            {project.costs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No cost entries yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {project.costs.map((cost) => (
                  <div
                    key={cost.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm mb-1 break-words">
                          {cost.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(cost.dateIncurred), "MMM dd, yyyy")}{" "}
                          • ${cost.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/projects/${projectId}/costs/${cost.id}/edit`}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteCost(cost.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Feedback Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Feedback
                </h3>
              </div>
              <Link href={`/admin/projects/${projectId}/feedback/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 sm:gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden xs:inline">Add</span>
                </motion.button>
              </Link>
            </div>

            {project.feedback.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No feedback yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {project.feedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white text-sm mb-2 break-words">
                          {fb.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>From: {fb.client.name}</span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(fb.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          {fb.rating && (
                            <>
                              <span>•</span>
                              <span>Rating: {fb.rating}/5</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/projects/${projectId}/feedback/${fb.id}/edit`}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteFeedback(fb.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Invoices Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Invoices
                </h3>
              </div>
              <Link href={`/admin/projects/${projectId}/invoices/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center gap-1 sm:gap-2 hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden xs:inline">Generate</span>
                </motion.button>
              </Link>
            </div>

            {project.invoices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No invoices yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {project.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          Invoice #{invoice.invoiceNumber}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>${invoice.totalAmount.toFixed(2)}</span>
                          <span>•</span>
                          <span>
                            Due:{" "}
                            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(invoice.status)}`}
                        >
                          {invoice.status.charAt(0)}
                        </span>
                        <div className="flex items-center gap-1">
                          {invoice.documentUrl && (
                            <a
                              href={invoice.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download Invoice"
                            >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
                              >
                                <Download className="w-3 h-3" />
                              </motion.button>
                            </a>
                          )}
                          <Link
                            href={`/admin/projects/${projectId}/invoices/${invoice.id}/edit`}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectDetailPage;
