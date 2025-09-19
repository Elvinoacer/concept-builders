"use client";

import Link from "next/link";

const ErrorPage = () => {
  return (
    <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Error Illustration */}
          <div className="flex justify-center md:order-2">
            <img
              alt="Illustration of a server error"
              className="rounded-lg object-cover w-full max-w-sm h-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBDTSfVD7EIQ9wcpUWGREzj8_xsbOUN5adz7izjqAuk4LqEkrzCQ_S2LRT5-H6lzrikUOtNkifrNYoCunS8KlXZp4ZzAi9lWGI7aNyhiEaqFDyPjNI_o7MSQtZKBuF4nzFTkJDtudZbY6TfuPnFM7y-PeYI4_8z82RqtrI_g0m0Km6mt2-W7Vc1DxTbwb2dbB5oFsswY8TTrCBkUrUkonBxVPVbRYWqBPtEpuZ1qSqDo7xjf5NIrdPClg1lfBOmaq08kOsd7GI8B_l"
            />
          </div>

          {/* Error Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 md:order-1">
            <span className="text-6xl font-bold text-red-500 dark:text-red-400">
              500
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Internal Server Error
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Oops! Something went wrong on our end. Our team has been notified.
              Please try again later.
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center rounded-md h-11 px-5 bg-gray-800 dark:bg-gray-100 dark:text-gray-900 text-white text-sm font-bold shadow-sm hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>

              <Link
                href="/contact"
                className="flex items-center justify-center rounded-md h-11 px-5 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-800 text-sm font-bold shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
