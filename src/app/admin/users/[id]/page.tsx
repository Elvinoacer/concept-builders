"use client";

import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserCheck, FaUserShield, FaUserTimes } from "react-icons/fa";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiCode,
  FiDollarSign,
  FiEdit,
  FiLink,
  FiLogIn,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

const UserDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "activity"
  >("overview");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/admin/users/${id}/edit`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user?.name || "this user"}?`
      )
    ) {
      try {
        await fetch(`/api/users/${id}/delete`, { method: "DELETE" });
        router.push("/admin/users");
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!user) return;

    const newStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      const endpoint = user.status === "ACTIVE" ? "block" : "unblock";
      await fetch(`/api/users/${id}/${endpoint}`, { method: "POST" });
      setUser({ ...user, status: newStatus });
    } catch (err) {
      setError("Failed to update user status");
    }
  };

  const handlePasswordReset = async () => {
    if (!user) return;

    if (
      window.confirm(
        `Reset password for ${user.name}? They will receive an email with instructions.`
      )
    ) {
      try {
        await fetch(`/api/users/${id}/reset-password`, { method: "POST" });
        alert("Password reset email sent successfully");
      } catch (err) {
        setError("Failed to reset password");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6">
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-4 xs:p-6 space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 xs:w-24 xs:h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 xs:p-6 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 xs:p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Error Loading User
            </h3>
            <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 xs:p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              User Not Found
            </h3>
            <p className="text-yellow-700 dark:text-yellow-400 mb-4">
              The user you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => router.push("/admin/users")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalOrders = user.orders?.length || 0;
  const totalSpent =
    user.orders?.reduce(
      (sum: number, order: any) => sum + (order.amount || 0),
      0
    ) || 0;
  const lastLogin = user.loginHistory?.[0]?.createdAt
    ? format(new Date(user.loginHistory[0].createdAt), "PPpp")
    : "Never logged in";
  const memberSince = format(new Date(user.createdAt), "MMMM yyyy");
  const timeSinceJoin = formatDistanceToNow(new Date(user.createdAt), {
    addSuffix: true,
  });

  const getStatusIcon = () => {
    switch (user.status) {
      case "ACTIVE":
        return <FaUserCheck className="w-5 h-5 text-green-500" />;
      case "BLOCKED":
        return <FaUserTimes className="w-5 h-5 text-red-500" />;
      default:
        return <FaUserShield className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (user.status) {
      case "ACTIVE":
        return "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/30";
      case "BLOCKED":
        return "text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto space-y-4 xs:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/users")}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl xs:text-3xl font-bold text-gray-800 dark:text-white">
                {user.name || "Unnamed User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base mt-1">
                User Details & Analytics
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePasswordReset}
              className="flex items-center gap-2 px-3 xs:px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="hidden xs:inline">Reset Password</span>
            </button>
            <button
              onClick={handleStatusToggle}
              className={`flex items-center gap-2 px-3 xs:px-4 py-2 text-sm rounded-lg transition-colors ${
                user.status === "ACTIVE"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
              }`}
            >
              <FiShield className="w-4 h-4" />
              <span className="hidden xs:inline">
                {user.status === "ACTIVE" ? "Block User" : "Unblock User"}
              </span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-3 xs:px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FiEdit className="w-4 h-4" />
              <span className="hidden xs:inline">Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 xs:px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              <span className="hidden xs:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-1">
          <nav className="flex gap-1">
            {[
              { id: "overview", label: "Overview", icon: FiUser },
              { id: "orders", label: "Purchases", icon: FiShoppingBag },
              { id: "activity", label: "Activity", icon: FiLogIn },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 xs:px-4 py-2.5 text-sm font-medium rounded-xl transition-colors flex-1 xs:flex-none justify-center ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1 space-y-4 xs:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6">
              <div className="flex flex-col items-center text-center mb-4 xs:mb-6">
                <div className="relative mb-4">
                  <Image
                    src={
                      user.image ||
                      "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
                    }
                    alt="User Avatar"
                    width={96}
                    height={96}
                    className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
                    {getStatusIcon()}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.name || "Unnamed User"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {user.email}
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                >
                  {getStatusIcon()}
                  {user.status}
                </div>
              </div>

              <div className="space-y-3 xs:space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <FiBriefcase className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Role
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <FiCalendar className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Member Since
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {memberSince}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {timeSinceJoin}
                    </p>
                  </div>
                </div>

                {user.bio && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Bio
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {user.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <FiDollarSign className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${totalSpent.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Total Spent
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <FiShoppingBag className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalOrders}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4 xs:space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Activity Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 xs:mb-6">
                    Activity Overview
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <FiLogIn className="w-6 h-6 text-purple-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Last Login
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {lastLogin}
                        </p>
                      </div>
                    </div>

                    {user.referralCode && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiCode className="w-6 h-6 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Referral Code
                          </p>
                          <p className="text-sm font-mono text-gray-600 dark:text-gray-400 truncate">
                            {user.referralCode}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.referredByCode && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiLink className="w-6 h-6 text-teal-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Referred By
                          </p>
                          <p className="text-sm font-mono text-gray-600 dark:text-gray-400 truncate">
                            {user.referredByCode}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <FiClock className="w-6 h-6 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Last Updated
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(user.updatedAt), "PPpp")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {user.loginHistory
                      ?.slice(0, 3)
                      .map((login: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                        >
                          <FiLogIn className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Login from {login.ipAddress}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(login.createdAt), "PPpp")}
                            </p>
                          </div>
                        </div>
                      ))}
                    {(!user.loginHistory || user.loginHistory.length === 0) && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Purchase History
                </h3>
                {user.orders && user.orders.length > 0 ? (
                  <div className="space-y-3">
                    {user.orders.slice(0, 10).map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            Order #{order.id.substring(0, 8)}...
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(order.createdAt), "PPpp")}
                          </p>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-lg">
                          ${order.amount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    ))}
                    {user.orders.length > 10 && (
                      <div className="text-center pt-4">
                        <button className="text-primary hover:text-primary-dark font-medium">
                          View All {user.orders.length} Purchases
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No purchase history found
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Login History
                </h3>
                {user.loginHistory && user.loginHistory.length > 0 ? (
                  <div className="space-y-3">
                    {user.loginHistory
                      .slice(0, 10)
                      .map((login: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              Successful login from {login.ipAddress}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(login.createdAt), "PPpp")}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiLogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No login history available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetailsPage;
