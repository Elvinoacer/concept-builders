"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Pagination from "@/components/ui/CustomPagination";

const UsersTable = ({ users, refetch, loading, searchTerm }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const router = useRouter();

  const getStatusChip = (status: "ACTIVE" | "BLOCKED") => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-2 xs:px-3 py-1 text-xs font-semibold leading-4 xs:leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
            {status}
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex rounded-full bg-red-100 px-2 xs:px-3 py-1 text-xs font-semibold leading-4 xs:leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const handleBlock = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Block User",
      message: "Are you sure you want to block this user?",
      onConfirm: async () => {
        await fetch(`/api/users/${id}/block`, { method: "POST" });
        refetch();
        setConfirmationModal({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: () => {},
        });
      },
    });
  };

  const handleUnblock = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Unblock User",
      message: "Are you sure you want to unblock this user?",
      onConfirm: async () => {
        await fetch(`/api/users/${id}/unblock`, { method: "POST" });
        refetch();
        setConfirmationModal({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: () => {},
        });
      },
    });
  };

  const handleResetLock = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Reset Password",
      message: "Are you sure you want to reset the password for this user?",
      onConfirm: async () => {
        await fetch(`/api/users/${id}/reset-password`, { method: "POST" });
        refetch();
        setConfirmationModal({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: () => {},
        });
      },
    });
  };

  const handleSendEmail = (user) => {
    setSelectedUser(user);
    setEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setEmailModal(false);
    setEmailStatus({ type: null, message: "" });
    setEmailSending(false);
  };

  const handleView = (user) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleViewAnalytics = (id: string) => {
    router.push(`/admin/users/${id}/analytics`);
  };

  const handleImpersonate = async (id: string) => {
    const response = await fetch(`/api/users/${id}/impersonate`, {
      method: "POST",
    });
    if (response.ok) {
      router.push("/admin/users");
    }
  };

  const handleLoginHistory = (id: string) => {
    router.push(`/admin/users/${id}/login-history`);
  };

  const handlePurchaseHistory = (id: string) => {
    router.push(`/admin/users/${id}/purchases`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`/api/users/${id}/delete`, { method: "DELETE" });
      refetch();
    }
  };

  const handleSendEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailSending(true);
    setEmailStatus({ type: null, message: "" });
    
    const subject = e.target.subject.value;
    const message = e.target.message.value;
    
    try {
      const response = await fetch("/api/users/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: selectedUser.email, subject, message }),
      });
      
      if (response.ok) {
        setEmailStatus({ 
          type: "success", 
          message: `Email sent successfully to ${selectedUser.name}!` 
        });
        setTimeout(() => {
          handleCloseEmailModal();
        }, 2000);
      } else {
        const data = await response.json();
        setEmailStatus({ 
          type: "error", 
          message: data.message || "Failed to send email. Please try again." 
        });
      }
    } catch (error) {
      setEmailStatus({ 
        type: "error", 
        message: "An error occurred while sending the email." 
      });
    } finally {
      setEmailSending(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 mx-2 xs:mx-4 sm:mx-0"
    >
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3 p-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading users...
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No users found.
          </div>
        ) : (
          currentItems.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {/* User Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-12 w-12 rounded-full"
                      src={user.image || "/images/default-avatar.png"}
                      alt={user.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      {getStatusChip(user.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  {user.status === "BLOCKED" ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleUnblock(user.id)}
                            className="p-2 text-gray-400 hover:text-green-600 focus:outline-none dark:hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <span className="material-symbols-outlined text-lg">
                              how_to_reg
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unblock User</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleBlock(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 focus:outline-none dark:hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <span className="material-symbols-outlined text-lg">
                              block
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Block User</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleResetLock(user.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none dark:hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <span className="material-symbols-outlined text-lg">
                            lock_reset
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset Password</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                      <span className="material-symbols-outlined text-lg">
                        more_vert
                      </span>
                    </MenubarTrigger>
                    <MenubarContent align="end" className="min-w-[180px]">
                      <MenubarItem
                        onClick={() => handleView(user)}
                        className="text-sm py-2"
                      >
                        View Profile
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleEdit(user.id)}
                        className="text-sm py-2"
                      >
                        Edit User
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleViewAnalytics(user.id)}
                        className="text-sm py-2"
                      >
                        View Analytics
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleImpersonate(user.id)}
                        className="text-sm py-2"
                      >
                        Impersonate
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleLoginHistory(user.id)}
                        className="text-sm py-2"
                      >
                        Login History
                      </MenubarItem>
                      {user.role === "CLIENT" && (
                        <MenubarItem
                          onClick={() => handlePurchaseHistory(user.id)}
                          className="text-sm py-2"
                        >
                          Purchase History
                        </MenubarItem>
                      )}
                      <MenubarItem
                        onClick={() => handleSendEmail(user)}
                        className="text-sm py-2"
                      >
                        Send Email
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleDelete(user.id)}
                        className="text-sm py-2 text-red-600 dark:text-red-400 focus:text-red-600"
                      >
                        Delete User
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Status
              </th>
              <th scope="col" className="relative px-3 py-3 md:px-6 md:py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading users...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              currentItems.map((user, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="whitespace-nowrap px-3 py-4 md:px-6 md:py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={user.image || "/images/default-avatar.png"}
                          alt={user.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user.role}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 md:px-6 md:py-4">
                    {getStatusChip(user.status)}
                  </td>
                  <td className="relative whitespace-nowrap px-3 py-4 md:px-6 md:py-4 text-right text-sm font-medium">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                        {user.status === "BLOCKED" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleUnblock(user.id)}
                                className="p-2 text-gray-400 hover:text-green-600 focus:outline-none dark:hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  how_to_reg
                                </span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unblock User</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleBlock(user.id)}
                                className="p-2 text-gray-400 hover:text-red-600 focus:outline-none dark:hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  block
                                </span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Block User</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleResetLock(user.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none dark:hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">
                                lock_reset
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reset Password</p>
                          </TooltipContent>
                        </Tooltip>
                        <Menubar>
                          <MenubarMenu>
                            <MenubarTrigger className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                more_vert
                              </span>
                            </MenubarTrigger>
                            <MenubarContent
                              align="end"
                              className="min-w-[180px]"
                            >
                              <MenubarItem
                                onClick={() => handleView(user)}
                                className="text-sm py-2"
                              >
                                View Profile
                              </MenubarItem>
                              <MenubarItem
                                onClick={() => handleEdit(user.id)}
                                className="text-sm py-2"
                              >
                                Edit User
                              </MenubarItem>
                              <MenubarItem
                                onClick={() => handleViewAnalytics(user.id)}
                                className="text-sm py-2"
                              >
                                View Analytics
                              </MenubarItem>
                              <MenubarItem
                                onClick={() => handleImpersonate(user.id)}
                                className="text-sm py-2"
                              >
                                Impersonate
                              </MenubarItem>
                              <MenubarItem
                                onClick={() => handleLoginHistory(user.id)}
                                className="text-sm py-2"
                              >
                                Login History
                              </MenubarItem>
                              {user.role === "CLIENT" && (
                                <MenubarItem
                                  onClick={() => handlePurchaseHistory(user.id)}
                                  className="text-sm py-2"
                                >
                                  Purchase History
                                </MenubarItem>
                              )}
                              <MenubarItem
                                onClick={() => handleSendEmail(user)}
                                className="text-sm py-2"
                              >
                                Send Email
                              </MenubarItem>
                              <MenubarItem
                                onClick={() => handleDelete(user.id)}
                                className="text-sm py-2 text-red-600 dark:text-red-400 focus:text-red-600"
                              >
                                Delete User
                              </MenubarItem>
                            </MenubarContent>
                          </MenubarMenu>
                        </Menubar>
                      </div>
                    </TooltipProvider>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-3 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 xs:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">
                      mail
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Send Email
                    </h3>
                    <p className="text-sm text-white/80">
                      To: {selectedUser?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseEmailModal}
                  disabled={emailSending}
                  className="text-white/80 hover:text-white focus:outline-none p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Status Messages */}
              {emailStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${
                    emailStatus.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      emailStatus.type === "success"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {emailStatus.type === "success"
                      ? "check_circle"
                      : "error"}
                  </span>
                  <p
                    className={`text-sm font-medium ${
                      emailStatus.type === "success"
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {emailStatus.message}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSendEmailSubmit} className="space-y-4">
                {/* Recipient Info */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Recipient
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedUser?.email}
                  </p>
                </div>

                {/* Subject Field */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    disabled={emailSending}
                    placeholder="Enter email subject..."
                    className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    disabled={emailSending}
                    placeholder="Type your message here..."
                    className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-vertical"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse xs:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseEmailModal}
                    disabled={emailSending}
                    className="flex-1 xs:flex-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={emailSending}
                    className="flex-1 xs:flex-none rounded-xl border border-transparent bg-gradient-to-r from-primary to-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:from-primary/90 hover:to-blue-600/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {emailSending ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">
                          progress_activity
                        </span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">
                          send
                        </span>
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-3 xs:p-4">
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 xs:p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 mx-auto">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {confirmationModal.title}
                </h3>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      isOpen: false,
                      title: "",
                      message: "",
                      onConfirm: () => {},
                    })
                  }
                  className="text-gray-400 hover:text-gray-500 focus:outline-none p-1"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {confirmationModal.message}
                </p>
              </div>
              <div className="mt-6 flex flex-col xs:flex-row gap-2 xs:gap-0 xs:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setConfirmationModal({
                      isOpen: false,
                      title: "",
                      message: "",
                      onConfirm: () => {},
                    })
                  }
                  className="order-2 xs:order-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmationModal.onConfirm}
                  className="order-1 xs:order-2 rounded-lg border border-transparent bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTable;
