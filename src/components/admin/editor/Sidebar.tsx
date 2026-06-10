"use client";

import { useState } from "react";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`transition-all duration-300 ${isOpen ? "w-96" : "w-16"} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 text-gray-700 dark:text-gray-300"
        >
          {isOpen ? "Collapse" : "Expand"}
        </button>
        <div className={isOpen ? "block" : "hidden"}>{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
