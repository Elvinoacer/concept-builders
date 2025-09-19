"use client";
import React from "react";
import { usePathname } from "next/navigation";

const ChatHeader = ({
  project,
}: {
  project: { title: string; id: string };
}) => {
  const pathname = usePathname();

  const navItems = [
    { href: "#overview", label: "Overview", id: "overview" },
    { href: "#design", label: "Design", id: "design" },
    { href: "#construction", label: "Construction", id: "construction" },
    { href: "#chat", label: "Chat", id: "chat" },
  ];

  const isActive = (id: string) => pathname?.includes(id);

  return (
    <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-8 py-6">
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          Project: {project.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Project ID: {project.id}
        </p>
      </div>
      <div className="px-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                isActive(item.id)
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
