"use client";
import Notifications from "@/components/dashboard/Notifications";
import QuickActions from "@/components/dashboard/QuickActions";
import SummaryCards from "@/components/dashboard/SummaryCards";

const DashboardPage = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-4xl font-bold leading-tight dark:text-white">
          Dashboard
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Welcome back, Sophia! Here's a summary of your account.
        </p>
      </header>
      <SummaryCards />
      <QuickActions />
      <Notifications />
    </div>
  );
};

export default DashboardPage;
