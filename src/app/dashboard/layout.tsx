import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-screen w-full bg-gray-50 group/design-root overflow-hidden dark:bg-gray-900"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <Sidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
          <div className="mb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
