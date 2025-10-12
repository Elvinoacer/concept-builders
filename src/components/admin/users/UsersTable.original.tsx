
"use client";

import { motion } from "framer-motion";
import Pagination from "./Pagination";
import { useState } from "react";

import Link from "next/link";

const UsersTable = ({ users, currentPage, itemsPerPage, onPageChange, onDeleteUser, onEditUser }: { users: any[], currentPage: number, itemsPerPage: number, onPageChange: (page: number) => void, onDeleteUser: (user: any) => void, onEditUser: (user: any) => void }) => {

  const getStatusChip = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {status}
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 mt-4 dark:bg-gray-800 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Name
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Email
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Role
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 md:px-6 md:py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.name}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">{user.email}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">{user.role}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">{getStatusChip(user.status)}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 text-right">
                  <Link href={`/admin/users/${user.id}`} className="font-medium text-primary hover:underline dark:text-blue-400 mr-4">
                    View
                  </Link>
                  <a
                    href="#"
                    onClick={() => onEditUser(user)}
                    className="font-medium text-primary hover:underline dark:text-blue-400 mr-4"
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    onClick={() => onDeleteUser(user)}
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                  >
                    Delete
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </motion.div>
  );
};

export default UsersTable;
