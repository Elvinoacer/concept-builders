import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminHeader from "@/components/admin/dashboard/AdminHeader";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 group/design-root overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
