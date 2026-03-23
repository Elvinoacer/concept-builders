"use client";
import {
  InvoiceStatus,
  InvoiceType,
  MilestoneStatus,
  ProjectStatus,
  RequirementStatus,
} from "@/generated/prisma";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Info,
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Image from "next/image";

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

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "costs" | "feedback" | "invoices"
  >("overview");

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error(`Failed to load project: ${response.status}`);
      }
      const data: Project = await response.json();
      setProject(data);
      toast.success("Project details loaded successfully!");
    } catch (err: any) {
      console.error("Error fetching project:", err);
      setError(err.message);
      toast.error(`Failed to load project: ${err.message}`);
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
    status: ProjectStatus | MilestoneStatus | RequirementStatus | InvoiceStatus,
  ) => {
    switch (status) {
      case ProjectStatus.PLANNING:
      case MilestoneStatus.PENDING:
      case RequirementStatus.PENDING:
      case InvoiceStatus.PENDING:
        return "bg-gold/20 text-gold border-gold/30";
      case ProjectStatus.IN_PROGRESS:
        return "bg-amber-900/30 text-amber-400 border-amber-800";
      case ProjectStatus.COMPLETED:
      case MilestoneStatus.COMPLETED:
      case RequirementStatus.MET:
      case InvoiceStatus.PAID:
        return "bg-emerald-900/30 text-emerald-400 border-emerald-800";
      case ProjectStatus.ON_HOLD:
      case MilestoneStatus.OVERDUE:
      case InvoiceStatus.OVERDUE:
        return "bg-orange-900/30 text-orange-400 border-orange-800";
      case ProjectStatus.CANCELLED:
      case RequirementStatus.NOT_MET:
      case InvoiceStatus.CANCELLED:
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-surface text-cream-dim border-cb-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "MET":
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "IN_PROGRESS":
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-8">
          {/* Skeleton Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-surface rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 bg-surface rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-surface rounded w-48 animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-cb-border animate-pulse">
              <div className="h-6 bg-surface rounded w-32 mb-4"></div>
              <div className="h-48 bg-surface rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-surface rounded w-full"></div>
                <div className="h-4 bg-surface rounded w-3/4"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl p-6 border border-cb-border animate-pulse"
                >
                  <div className="h-6 bg-surface rounded w-24 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-surface rounded w-full"></div>
                    <div className="h-4 bg-surface rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-cream mb-2">
            Unable to Load Project
          </h2>
          <p className="text-cream-dim mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchProject}
              className="bg-gold text-ink px-6 py-3 rounded-xl font-semibold hover:bg-gold-light transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard/projects")}
              className="px-6 py-3 text-cream-dim bg-surface border border-cb-border rounded-xl font-semibold hover:bg-card transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </motion.div>
        <Toaster position="bottom-right" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-cream mb-2">
            Project Not Found
          </h2>
          <p className="text-cream-dim mb-6">
            The project you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="bg-gold text-ink px-6 py-3 rounded-xl font-semibold hover:bg-gold-light transition-colors"
          >
            Back to Projects
          </button>
        </motion.div>
        <Toaster position="bottom-right" />
      </div>
    );
  }

  // Mobile Tabs Component
  const MobileTabs = () => (
    <div className="lg:hidden sticky top-0 bg-ink z-10 pt-4 pb-2 -mx-4 px-4 border-b border-cb-border">
      <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: "overview", label: "Overview", count: null },
          {
            id: "milestones",
            label: "Milestones",
            count: project.milestones.length,
          },
          { id: "costs", label: "Costs", count: project.costs.length },
          { id: "feedback", label: "Feedback", count: project.feedback.length },
          { id: "invoices", label: "Invoices", count: project.invoices.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-card text-cream shadow-sm border border-cb-border"
                : "text-cream-dim hover:text-cream"
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span
                className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? "bg-gold/20 text-gold"
                    : "bg-surface text-cream-dim"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Mobile Content Component
  const MobileContent = () => (
    <div className="lg:hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <OverviewSection
              project={project}
              getStatusColorClass={getStatusColorClass}
            />
          )}
          {activeTab === "milestones" && (
            <MilestonesSection
              project={project}
              getStatusColorClass={getStatusColorClass}
            />
          )}
          {activeTab === "costs" && <CostsSection project={project} />}
          {activeTab === "feedback" && <FeedbackSection project={project} />}
          {activeTab === "invoices" && (
            <InvoicesSection
              project={project}
              getStatusColorClass={getStatusColorClass}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 min-[375px]:px-5 sm:px-6 md:px-8 pt-6 sm:pt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-surface transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-cream-dim" />
            </motion.button>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-cream leading-tight truncate">
                {project.name}
              </h1>
              <p className="text-cream-dim mt-1 text-sm sm:text-base">
                Client: {project.user.name} • {project.user.email}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Mobile Tabs */}
        <MobileTabs />

        {/* Content */}
        <div className="px-4 min-[375px]:px-5 sm:px-6 md:px-8 pb-6 sm:pb-8">
          {/* Mobile Content */}
          <MobileContent />

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {/* Left Column - Overview */}
            <div className="lg:col-span-2">
              <OverviewSection
                project={project}
                getStatusColorClass={getStatusColorClass}
              />
            </div>

            {/* Right Column - Related Entities */}
            <div className="space-y-6">
              <MilestonesSection
                project={project}
                getStatusColorClass={getStatusColorClass}
              />
              <CostsSection project={project} />
              <FeedbackSection project={project} />
              <InvoicesSection
                project={project}
                getStatusColorClass={getStatusColorClass}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

// Extracted Section Components
const OverviewSection = ({
  project,
  getStatusColorClass,
}: {
  project: Project;
  getStatusColorClass: any;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl p-6 border border-cb-border"
  >
    <h3 className="text-xl font-bold text-cream mb-4">Project Overview</h3>

    {project.imageUrl && (
      <div className="relative w-full h-48 sm:h-64 mb-6 rounded-xl overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.name}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>
    )}

    {project.description && (
      <p className="text-cream-dim mb-6 leading-relaxed">
        {project.description}
      </p>
    )}

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-cream-dim">Status</span>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColorClass(project.status)} flex items-center gap-2`}
        >
          {project.status.replace(/_/g, " ")}
        </span>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-cream-dim">Progress</span>
          <span className="text-sm font-bold text-cream">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-surface rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-2.5 rounded-full ${
              getStatusColorClass(project.status).split(" ")[0]
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-cream-dim">Total Cost</span>
        <span className="text-lg font-bold text-cream flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          {project.totalCost.toFixed(2)}
        </span>
      </div>

      {project.completionRemarks && (
        <div className="pt-4 border-t border-cb-border">
          <p className="text-sm font-medium text-cream mb-2">
            Completion Remarks:
          </p>
          <p className="text-sm text-cream-dim leading-relaxed">
            {project.completionRemarks}
          </p>
        </div>
      )}

      {project.declaration && (
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Project declared complete</span>
        </div>
      )}
    </div>
  </motion.div>
);

const MilestonesSection = ({
  project,
  getStatusColorClass,
}: {
  project: Project;
  getStatusColorClass: any;
}) => (
  <Section
    title="Milestones"
    count={project.milestones.length}
    emptyMessage="No milestones set for this project yet."
    icon={<Calendar className="w-5 h-5" />}
  >
    <ul className="space-y-3">
      {project.milestones.map((milestone) => (
        <li
          key={milestone.id}
          className="bg-surface p-4 rounded-xl border border-cb-border"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-cream mb-1">{milestone.name}</p>
              <p className="text-xs text-muted mb-1">
                Due: {format(new Date(milestone.dueDate), "MMM dd, yyyy")}
              </p>
              {milestone.description && (
                <p className="text-sm text-cream-dim line-clamp-2">
                  {milestone.description}
                </p>
              )}
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 whitespace-nowrap ${getStatusColorClass(milestone.status)}`}
            >
              {milestone.status.replace(/_/g, " ")}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

const CostsSection = ({ project }: { project: Project }) => (
  <Section
    title="Costs"
    count={project.costs.length}
    emptyMessage="No cost entries recorded for this project yet."
    icon={<DollarSign className="w-5 h-5" />}
  >
    <ul className="space-y-3">
      {project.costs.map((cost) => (
        <li
          key={cost.id}
          className="bg-surface p-4 rounded-xl border border-cb-border"
        >
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-cream mb-1">{cost.description}</p>
              <p className="text-xs text-muted">
                {format(new Date(cost.dateIncurred), "MMM dd, yyyy")}
              </p>
            </div>
            <span className="text-lg font-bold text-cream whitespace-nowrap">
              ${cost.amount.toFixed(2)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

const FeedbackSection = ({ project }: { project: Project }) => (
  <Section
    title="Feedback"
    count={project.feedback.length}
    emptyMessage="No feedback recorded for this project yet."
    icon={<Info className="w-5 h-5" />}
  >
    <ul className="space-y-3">
      {project.feedback.map((fb) => (
        <li
          key={fb.id}
          className="bg-surface p-4 rounded-xl border border-cb-border"
        >
          <p className="font-medium text-cream mb-2">{fb.message}</p>
          <div className="flex justify-between items-center text-xs text-muted">
            <span>From: {fb.client.name}</span>
            <span>
              {formatDistanceToNow(new Date(fb.createdAt), { addSuffix: true })}
            </span>
          </div>
          {fb.rating && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted">Rating:</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < fb.rating!} />
                ))}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  </Section>
);

const InvoicesSection = ({
  project,
  getStatusColorClass,
}: {
  project: Project;
  getStatusColorClass: any;
}) => (
  <Section
    title="Invoices"
    count={project.invoices.length}
    emptyMessage="No invoices generated for this project yet."
    icon={<Download className="w-5 h-5" />}
  >
    <ul className="space-y-3">
      {project.invoices.map((invoice) => (
        <li
          key={invoice.id}
          className="bg-surface p-4 rounded-xl border border-cb-border"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-cream mb-1">
                Invoice #{invoice.invoiceNumber}
              </p>
              <p className="text-xs text-muted">
                Due: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColorClass(invoice.status)}`}
              >
                {invoice.status.replace(/_/g, " ")}
              </span>
              {invoice.documentUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={invoice.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 p-1"
                  title="Download Invoice"
                >
                  <Download className="w-4 h-4" />
                </motion.a>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-cream-dim">
              Total Amount
            </span>
            <span className="text-lg font-bold text-cream">
              ${invoice.totalAmount.toFixed(2)}
            </span>
          </div>

          {invoice.invoiceItems.length > 0 && (
            <div className="pt-3 border-t border-cb-border">
              <p className="text-sm font-medium text-cream mb-2">Items:</p>
              <ul className="space-y-1 text-xs text-cream-dim">
                {invoice.invoiceItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span className="flex-1 truncate">
                      {item.description} (x{item.quantity})
                    </span>
                    <span className="flex-shrink-0 ml-2">
                      ${item.total.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  </Section>
);

// Reusable Section Component
const Section = ({
  title,
  count,
  emptyMessage,
  icon,
  children,
}: {
  title: string;
  count: number;
  emptyMessage: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl p-6 border border-cb-border"
  >
    <h3 className="text-xl font-bold text-cream mb-4 flex items-center gap-2">
      {icon}
      <span>{title}</span>
      {count > 0 && (
        <span className="px-2 py-1 text-xs font-semibold bg-gold/20 text-gold rounded-full">
          {count}
        </span>
      )}
    </h3>

    {count === 0 ? (
      <div className="flex flex-col items-center justify-center py-8 text-muted">
        <Info className="w-8 h-8 mb-3" />
        <p className="text-sm text-center">{emptyMessage}</p>
      </div>
    ) : (
      children
    )}
  </motion.div>
);

// Star Rating Component
const Star = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-3 h-3 ${filled ? "text-yellow-500 fill-current" : "text-muted"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default ProjectDetailPage;
