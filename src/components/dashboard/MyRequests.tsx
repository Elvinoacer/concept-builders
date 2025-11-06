"use client";

import {
  CustomDesignRequest,
  CustomDesignRequestStatus,
} from "@/generated/prisma";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyRequests = () => {
  const [requests, setRequests] = useState<CustomDesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    CustomDesignRequestStatus | "all"
  >("all");
  const router = useRouter();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard/my-requests");
        if (!res.ok) {
          throw new Error("Failed to fetch your custom design requests");
        }
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching custom design requests:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on search and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.designType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.budget.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const refreshRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/my-requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      setError(error.message || "Failed to refresh requests");
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color and icon
  const getStatusConfig = (status: CustomDesignRequestStatus) => {
    const config = {
      PENDING: {
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        icon: Clock,
      },
      IN_PROGRESS: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        icon: Building2,
      },
      COMPLETED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle2,
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: AlertCircle,
      },
    };
    return config[status] || config.PENDING;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  if (loading) {
    return (
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Custom Design Requests
          </h3>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Custom Design Requests
          </h3>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Requests
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {error}
          </p>
          <motion.button
            onClick={refreshRequests}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors duration-200 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Custom Design Requests
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {filteredRequests.length} request
            {filteredRequests.length !== 1 ? "s" : ""} • Track your custom
            designs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={refreshRequests}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
            title="Refresh requests"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>

          <motion.a
            href="/custom-design"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            {isMobile ? "New" : "New Request"}
          </motion.a>
        </div>
      </div>

      {/* Search and Filters */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as CustomDesignRequestStatus | "all"
              )
            }
            className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm min-w-32"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Requests Content */}
      <AnimatePresence>
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {requests.length === 0
                ? "No Requests Yet"
                : "No Matching Requests"}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              {requests.length === 0
                ? "You haven't made any custom design requests yet. Start your first custom project!"
                : "No requests match your current search and filter criteria."}
            </p>
            <motion.a
              href="/custom-design"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              {requests.length === 0
                ? "Start First Request"
                : "New Custom Request"}
            </motion.a>
          </motion.div>
        ) : isMobile ? (
          /* Mobile Card View */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={request.id}
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => router.push(`/custom-design/${request.id}`)}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 p-4 transition-all duration-300 cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
                          {request.designType}
                        </h4>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Budget:</span>
                      <span className="text-gray-900 dark:text-white">
                        {request.budget}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <StatusIcon className="w-4 h-4" />
                      <span className="font-medium">Status:</span>
                      <span className="text-gray-900 dark:text-white capitalize">
                        {request.status.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Progress indicator for in-progress requests */}
                  {request.status === "IN_PROGRESS" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>50%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Desktop Table View */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200/50 dark:border-gray-700/50">
                    <th className="text-left p-4 sm:p-6">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Design Type
                      </span>
                    </th>
                    <th className="text-left p-4 sm:p-6">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Date
                      </span>
                    </th>
                    <th className="text-left p-4 sm:p-6">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Budget
                      </span>
                    </th>
                    <th className="text-left p-4 sm:p-6">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </span>
                    </th>
                    <th className="p-4 sm:p-6 w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {filteredRequests.map((request) => {
                    const statusConfig = getStatusConfig(request.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <motion.tr
                        key={request.id}
                        variants={itemVariants}
                        onClick={() =>
                          router.push(`/custom-design/${request.id}`)
                        }
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 cursor-pointer group"
                      >
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-base">
                                {request.designType}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-sm">
                                Custom Design Request
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">
                              {request.budget}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                            >
                              {request.status.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {filteredRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            {
              status: "PENDING",
              count: requests.filter((r) => r.status === "PENDING").length,
              color: "amber",
            },
            {
              status: "IN_PROGRESS",
              count: requests.filter((r) => r.status === "IN_PROGRESS").length,
              color: "blue",
            },
            {
              status: "COMPLETED",
              count: requests.filter((r) => r.status === "COMPLETED").length,
              color: "green",
            },
            { status: "TOTAL", count: requests.length, color: "gray" },
          ].map((stat) => (
            <div
              key={stat.status}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 text-center border-2 border-gray-200/50 dark:border-gray-700/50"
            >
              <div
                className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-1`}
              >
                {stat.count}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {stat.status.toLowerCase().replace("_", " ")}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default MyRequests;
