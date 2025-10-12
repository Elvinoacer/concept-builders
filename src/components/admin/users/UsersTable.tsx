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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Pagination from "@/components/ui/Pagination";

const UsersTable = ({ users, refetch, loading, searchTerm }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
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
          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
            {status}
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
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
        setConfirmationModal({ isOpen: false, title: "", message: "", onConfirm: () => {} });
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
        setConfirmationModal({ isOpen: false, title: "", message: "", onConfirm: () => {} });
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
        setConfirmationModal({ isOpen: false, title: "", message: "", onConfirm: () => {} });
      },
    });
  };

  const handleSendEmail = (user) => {
    setSelectedUser(user);
    setEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setEmailModal(false);
  };

  const handleView = (user) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleViewAnalytics = (id: string) => {
    router.push(`/admin/users/${id}/analytics`);
  };

  const handleImpersonate = async (id: string) => {
    const response = await fetch(`/api/users/${id}/impersonate`, { method: "POST" });
    if (response.ok) {
      router.push('/admin/users');
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
    const subject = e.target.subject.value;
    const message = e.target.message.value;
    await fetch("/api/users/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: selectedUser.email, subject, message }),
    });
    handleCloseEmailModal();
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
      className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="overflow-visible">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Status
              </th>
              <th scope="col" className="relative px-3 py-2 md:px-6 md:py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
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
                  <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={user.image || '/images/default-avatar.png'}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user.role}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4">
                    {getStatusChip(user.status)}
                  </td>
                  <td className="relative whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-right text-sm font-medium">
                    <TooltipProvider>
                      <div className="relative flex items-center justify-end gap-2 sm:gap-4">
                        {user.status === 'BLOCKED' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => handleUnblock(user.id)} className="text-gray-400 hover:text-green-600 focus:outline-none dark:hover:text-green-500">
                                <span className="material-symbols-outlined">how_to_reg</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unblock User</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => handleBlock(user.id)} className="text-gray-400 hover:text-red-600 focus:outline-none dark:hover:text-red-500">
                                <span className="material-symbols-outlined">block</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Block User</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleResetLock(user.id)} className="text-gray-400 hover:text-blue-600 focus:outline-none dark:hover:text-blue-500">
                              <span className="material-symbols-outlined">
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
                            <MenubarTrigger className="text-gray-400 hover:text-gray-600 focus:outline-none dark:hover:text-gray-300">
                              <span className="material-symbols-outlined">more_vert</span>
                            </MenubarTrigger>
                            <MenubarContent>
                              <MenubarItem onClick={() => handleView(user)}>
                                View
                              </MenubarItem>
                              <MenubarItem onClick={() => handleEdit(user.id)}>
                                Edit
                              </MenubarItem>
                              <MenubarItem onClick={() => handleDelete(user.id)}>
                                Delete
                              </MenubarItem>
                              <MenubarItem onClick={() => handleViewAnalytics(user.id)}>
                                View Analytics
                              </MenubarItem>
                              <MenubarItem onClick={() => handleImpersonate(user.id)}>
                                Impersonate
                              </MenubarItem>
                              <MenubarItem onClick={() => handleLoginHistory(user.id)}>
                                Login History
                              </MenubarItem>
                              {user.role === 'CLIENT' && (
                                <MenubarItem onClick={() => handlePurchaseHistory(user.id)}>
                                  Purchase History
                                </MenubarItem>
                              )}
                              <MenubarItem onClick={() => handleSendEmail(user)}>
                                Send Email
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
      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      {emailModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black/30 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Send Email to {selectedUser.name}
                </h3>
                <button onClick={handleCloseEmailModal} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="mt-4">
                <form onSubmit={handleSendEmailSubmit}>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseEmailModal}
                      className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black/30 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {confirmationModal.title}
                </h3>
                <button onClick={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {confirmationModal.message}
                </p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmationModal.onConfirm}
                  className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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