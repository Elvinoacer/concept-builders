"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MessageSquare,
  FileText,
  Download,
  Upload,
} from "lucide-react";
import {
  ProjectStatus,
  MilestoneStatus,
  RequirementStatus,
  InvoiceStatus,
  InvoiceType,
} from "@/generated/prisma";
import { format, formatDistanceToNow } from "date-fns";

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

  const handleUpdateProjectStatus = async (newStatus: ProjectStatus) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update project status");
      fetchProject();
    } catch (err: any) {
      console.error("Error updating project status:", err);
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
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading project details...
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

  if (!project) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Project: {project.name}
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Client: {project.user.name} ({project.user.email})
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Overview
          </h3>
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {project.description}
            </p>
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status
              </span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(project.status)}`}
              >
                {project.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Progress
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Estimated Cost
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                ${project.totalCost.toFixed(2)}
              </span>
            </div>
            {project.completionRemarks && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completion Remarks:
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {project.completionRemarks}
                </p>
              </div>
            )}
            {project.declaration && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Project declared complete.
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Link href={`/admin/projects/${projectId}/edit`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Project</span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteProject(projectId)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Project</span>
            </motion.button>
          </div>
        </div>

        {/* Related Entities */}
        <div className="lg:col-span-1 space-y-8">
          {/* Milestones */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Milestones</span>
              <Link href={`/admin/projects/${projectId}/milestones/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add</span>
                </motion.button>
              </Link>
            </h3>
            {project.milestones.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No milestones yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {project.milestones.map((milestone) => (
                  <li
                    key={milestone.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {milestone.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due:{" "}
                        {format(new Date(milestone.dueDate), "MMM dd, yyyy")}
                      </p>
                      {milestone.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(milestone.status)}`}
                      >
                        {milestone.status.replace(/_/g, " ")}
                      </span>
                      <Link
                        href={`/admin/projects/${projectId}/milestones/${milestone.id}/edit`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Requirements</span>
              <Link href={`/admin/projects/${projectId}/requirements/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add</span>
                </motion.button>
              </Link>
            </h3>
            {project.requirements.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No requirements yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {project.requirements.map((requirement) => (
                  <li
                    key={requirement.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {requirement.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(requirement.status)}`}
                      >
                        {requirement.status.replace(/_/g, " ")}
                      </span>
                      <Link
                        href={`/admin/projects/${projectId}/requirements/${requirement.id}/edit`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteRequirement(requirement.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Costs */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Costs</span>
              <Link href={`/admin/projects/${projectId}/costs/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add</span>
                </motion.button>
              </Link>
            </h3>
            {project.costs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No cost entries yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {project.costs.map((cost) => (
                  <li
                    key={cost.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {cost.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(cost.dateIncurred), "MMM dd, yyyy")}: $
                        {cost.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/projects/${projectId}/costs/${cost.id}/edit`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteCost(cost.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Feedback */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Feedback</span>
              <Link href={`/admin/projects/${projectId}/feedback/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add</span>
                </motion.button>
              </Link>
            </h3>
            {project.feedback.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No feedback yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {project.feedback.map((fb) => (
                  <li
                    key={fb.id}
                    className="flex items-start justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {fb.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        From: {fb.client.name} (
                        {formatDistanceToNow(new Date(fb.createdAt), {
                          addSuffix: true,
                        })}
                        )
                      </p>
                      {fb.rating && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Rating: {fb.rating}/5
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/projects/${projectId}/feedback/${fb.id}/edit`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteFeedback(fb.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Invoices</span>
              <Link href={`/admin/projects/${projectId}/invoices/new`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Generate Invoice</span>
                </motion.button>
              </Link>
            </h3>
            {project.invoices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No invoices yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {project.invoices.map((invoice) => (
                  <li
                    key={invoice.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Invoice #{invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total: ${invoice.totalAmount.toFixed(2)} - Due:{" "}
                        {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(invoice.status)}`}
                      >
                        {invoice.status.replace(/_/g, " ")}
                      </span>
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
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${projectId}/invoices/${invoice.id}/edit`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectDetailPage;
