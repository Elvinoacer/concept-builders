"use client";
import React from "react";
import NotificationsHeader from "@/components/dashboard/notifications/NotificationsHeader";
import NotificationList from "@/components/dashboard/notifications/NotificationList";
import { notifications } from "@/lib/notifications";

const NotificationsPage = () => {
  return (
    <div className="layout-content-container flex flex-col w-full max-w-[960px] mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <NotificationsHeader />
      <NotificationList notifications={notifications} />
    </div>
  );
};

export default NotificationsPage;
