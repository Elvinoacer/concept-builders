"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UsersHeader from "@/components/admin/users/UsersHeader";
import UsersTabs from "@/components/admin/users/UsersTabs";
import UsersTable from "@/components/admin/users/UsersTable";

import AddUserModal from "@/components/admin/users/AddUserModal";
import DeleteUserModal from "@/components/admin/users/DeleteUserModal";
import EditUserModal from "@/components/admin/users/EditUserModal";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((user) => (user.id === updatedUser.id ? data : user)));
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
        method: 'DELETE',
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
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    try {
      let url = '/api/users';
      if (activeTab === "Clients") {
        url = '/api/users?role=clients';
      } else if (activeTab === "Team") {
        url = '/api/users?role=team';
      }
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const filteredUsers = users.filter((user) => {
    if (searchTerm === "") return true;
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <UsersHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} onAddUser={openModal} />
      <div className="mt-4 md:mt-6">
        <UsersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {!loading && !error && <UsersTable users={filteredUsers} refetch={fetchUsers} loading={loading} searchTerm={searchTerm} />}
        </div>
      </div>
      <AddUserModal isOpen={isModalOpen} onClose={closeModal} onAddUser={handleAddUser} />
      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteUser} userName={userToDelete?.name} />
      <EditUserModal isOpen={isEditModalOpen} onClose={closeEditModal} onEditUser={handleEditUser} user={userToEdit} />
    </motion.div>
  );
};

export default UsersPage;