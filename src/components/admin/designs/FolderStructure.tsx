"use client";

import { folderData } from "@/lib/folder-data";
import { motion } from "framer-motion";

const FolderStructure = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">Folder Structure</h2>
        <button className="flex items-center gap-2 min-w-[84px] cursor-pointer rounded-md h-10 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-bold">
          <span className="material-symbols-outlined">create_new_folder</span>
          <span className="truncate">New Folder</span>
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-muted-foreground uppercase bg-muted">
            <tr>
              <th scope="col" className="px-4 py-3 sm:px-6">
                Name
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6">
                Last Modified
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6">
                Size
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {folderData.map((folder, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border-b border-border hover:bg-muted"
              >
                <th
                  scope="row"
                  className="px-4 py-4 sm:px-6 font-medium text-foreground whitespace-nowrap flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-yellow-500">
                    folder
                  </span>
                  <span className="truncate max-w-[200px]">{folder.name}</span>
                </th>
                <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                  {folder.lastModified}
                </td>
                <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                  {folder.size}
                </td>
                <td className="px-4 py-4 sm:px-6 text-right">
                  <a
                    href="#"
                    className="font-medium text-primary hover:underline whitespace-nowrap"
                  >
                    View
                  </a>
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
