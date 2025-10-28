"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiMail, FiUser, FiBriefcase, FiCalendar, FiClock, FiCode, FiDollarSign, FiLogIn, FiLink } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { format } from "date-fns";

const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) return <div className="p-4 md:p-6">Loading user details...</div>;
  if (error) return <div className="p-4 md:p-6 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-4 md:p-6">User not found</div>;

  const totalOrders = user.orders?.length || 0;
  const totalSpent = user.orders?.reduce((sum: number, order: any) => sum + order.amount, 0) || 0;
  const lastLogin = user.loginHistory?.[0]?.createdAt ? format(new Date(user.loginHistory[0].createdAt), 'PPP p') : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">User Details: {user.name || user.email}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex flex-col items-center">
            <Image
              src={user.image || "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"}
              alt="User Avatar"
              width={96}
              height={96}
              className="rounded-full object-cover mb-4 border-2 border-blue-500"
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name || "N/A"}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FiUser className="text-blue-500" />
              <span>Role: <span className="font-medium capitalize">{user.role.toLowerCase()}</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaUserShield className="text-blue-500" />
              <span>Status: <span className="font-medium capitalize">{user.status.toLowerCase()}</span></span>
            </div>
            {user.adminRole && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FiBriefcase className="text-blue-500" />
                <span>Admin Role: <span className="font-medium">{user.adminRole}</span></span>
              </div>
            )}
            {user.bio && (
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Bio:</p>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm">{user.bio}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FiCalendar className="text-blue-500" />
              <span>Joined: <span className="font-medium">{format(new Date(user.createdAt), 'PPP')}</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FiClock className="text-blue-500" />
              <span>Last Updated: <span className="font-medium">{format(new Date(user.updatedAt), 'PPP p')}</span></span>
            </div>
          </div>
        </div>

        {/* Activity Summary Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiMail className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Purchases</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{totalOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiLogIn className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{lastLogin}</p>
              </div>
            </div>
            {user.referralCode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FiCode className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Referral Code</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{user.referralCode}</p>
                </div>
              </div>
            )}
            {user.referredByCode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FiLink className="w-6 h-6 text-teal-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Referred By</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{user.referredByCode}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders (Placeholder) */}
      {user.orders && user.orders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Purchases</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {user.orders.slice(0, 5).map((order: any) => (
              <li key={order.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order #{order.id.substring(0, 8)}...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(order.createdAt), 'PPP')}</p>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">${order.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          {user.orders.length > 5 && (
            <div className="text-center mt-4">
              <a href="/admin/purchases" className="text-blue-600 hover:underline">View All Purchases</a>
            </div>
          )}
        </div>
      )}

      {/* Recent Logins (Placeholder) */}
      {user.loginHistory && user.loginHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Logins</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {user.loginHistory.slice(0, 5).map((login: any, index: number) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{format(new Date(login.createdAt), 'PPP p')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">IP: {login.ipAddress}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default UserDetailsPage;
