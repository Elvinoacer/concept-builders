"use client";

const Loading = () => {
  return (
    <div className="h-screen flex-1 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
      <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-cyan-400"></div>
    </div>
  );
};

export default Loading;