'use client';
import Notifications from '@/components/dashboard/Notifications';
import PurchasedDesigns from '@/components/dashboard/PurchasedDesigns';
import RecommendedDesigns from '@/components/dashboard/RecommendedDesigns';

const DashboardPage = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Dashboard
        </h2>
        <p className="text-gray-500 mt-0.5 md:mt-1 dark:text-gray-400">
          Welcome back, Sophia! Here&apos;s a summary of your account.
        </p>
      </header>
      <PurchasedDesigns />
      <RecommendedDesigns />
      <Notifications />
    </div>
  );
};

export default DashboardPage;
