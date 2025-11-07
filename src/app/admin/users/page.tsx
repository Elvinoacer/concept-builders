"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UsersHeader from "@/components/admin/users/UsersHeader";
import UsersTabs from "@/components/admin/users/UsersTabs";
import UsersTable from "@/components/admin/users/UsersTable";
import AddUserModal from "@/components/admin/users/AddUserModal";
import DeleteUserModal from "@/components/admin/users/DeleteUserModal";
import EditUserModal from "@/components/admin/users/EditUserModal";
import { Loader2, RefreshCw, Users, AlertCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    clients: 0,
    team: 0,
    active: 0,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Filter users based on active tab and search term
  useEffect(() => {
    let filtered = users;

    // Filter by active tab
    if (activeTab === "Clients") {
      filtered = filtered.filter(
        (user) => user.role === "CLIENT" || user.role === "USER"
      );
    } else if (activeTab === "Team") {
      filtered = filtered.filter(
        (user) => user.role === "ADMIN" || user.role === "STAFF"
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, activeTab, searchTerm]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setUserToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const res = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? data : user))
        );
        closeEditModal();
      } else {
        setError(data);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        closeDeleteModal();
      } else {
        const data = await res.json();
        setError(data);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers([...users, data]);
        closeModal();
      } else {
        setError(data);
      }
    } catch (error) {
      setError(error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);
    try {
      let url = "/api/users";
      if (activeTab === "Clients") {
        url = "/api/users?role=clients";
      } else if (activeTab === "Team") {
        url = "/api/users?role=team";
      }
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);

      // Calculate stats
      const total = data.length;
      const clients = data.filter(
        (user) => user.role === "CLIENT" || user.role === "USER"
      ).length;
      const team = data.filter(
        (user) => user.role === "ADMIN" || user.role === "STAFF"
      ).length;
      const active = data.filter((user) => user.isActive !== false).length;

      setStats({ total, clients, team, active });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleRefresh = () => {
    fetchUsers();
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Error State
  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
    >
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Unable to Load Users
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {error?.message || "An error occurred while loading users"}
      </p>
      <Button onClick={fetchUsers}>Try Again</Button>
    </motion.div>
  );

  // Stats Cards
  const StatsCards = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
    >
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Users
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.clients}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Clients
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.team}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Team</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.active}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base sm:text-lg">
              Manage system users, clients, and team members
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredUsers.length} users
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">View</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setItemsPerPage(10)}>
                  10 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setItemsPerPage(25)}>
                  25 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setItemsPerPage(50)}>
                  50 per page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Card */}
        <Card className="border-0 bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white">
                  Users
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Manage and monitor all system users
                </CardDescription>
              </div>

              <UsersHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddUser={openModal}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Tabs */}
            <div className="px-4 sm:px-6">
              <UsersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 pt-4">
              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <ErrorState />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${searchTerm}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UsersTable
                      users={filteredUsers}
                      refetch={fetchUsers}
                      loading={loading}
                      searchTerm={searchTerm}
                      onEditUser={openEditModal}
                      onDeleteUser={openDeleteModal}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Results Summary */}
              {!loading && !error && filteredUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {Math.min(filteredUsers.length, itemsPerPage)} of{" "}
                    {filteredUsers.length} users
                    {searchTerm && (
                      <span> matching &quot;{searchTerm}&quot;</span>
                    )}
                  </p>

                  {filteredUsers.length > itemsPerPage && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        Page {currentPage} of{" "}
                        {Math.ceil(filteredUsers.length / itemsPerPage)}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empty State - Show when no users but not loading/error */}
        {!loading && !error && filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mt-6"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No users found" : "No users yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Get started by adding the first user to your system."}
            </p>
            {!searchTerm && (
              <Button onClick={openModal} size="lg">
                Add First User
              </Button>
            )}
            {searchTerm && (
              <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
            )}
          </motion.div>
        )}

        {/* Bottom Spacing */}
        <div className="h-6 sm:h-8 lg:h-12"></div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddUser={handleAddUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.name}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEditUser={handleEditUser}
        user={userToEdit}
      />
    </motion.div>
  );
};

export default UsersPage;
