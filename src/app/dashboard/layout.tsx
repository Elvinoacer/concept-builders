"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen w-full bg-gray-50 group/design-root overflow-hidden dark:bg-gray-900"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-col flex-1 w-0">
        <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1  overflow-y-auto dark:bg-gray-950">
          {children}
        </main>
      </div>
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
