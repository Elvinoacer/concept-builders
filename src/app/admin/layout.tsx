"use client";
import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminHeader from "@/components/admin/dashboard/AdminHeader";
import React, { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 group/design-root overflow-hidden">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
