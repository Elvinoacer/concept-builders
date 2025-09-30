"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const FolderStructure = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/designs/folders");
        const data = await response.json();
        setFolders(data);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
      setLoading(false);
    };

    fetchFolders();
  }, []);

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-4 md:mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Folder Structure</h2>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-muted-foreground uppercase bg-muted">
            <tr>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Name
              </th>
              <th scope="col" className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Last Modified
              </th>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {folders.map((folder, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border-b border-border hover:bg-muted"
              >
                <th
                  scope="row"
                  className="px-2 py-2 md:px-4 md:py-4 sm:px-6 font-medium text-foreground whitespace-nowrap flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-yellow-500">
                    folder
                  </span>
                  <span className="truncate max-w-[100px] sm:max-w-[200px]">{folder.name}</span>
                </th>
                <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                  {formatDate(folder.updatedAt)}
                </td>
                <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 text-right">
                  <Link href={`/admin/designs/folders/${folder.id}`} legacyBehavior>
                    <a className="font-medium text-primary hover:underline whitespace-nowrap">
                      View
                    </a>
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FolderStructure;
