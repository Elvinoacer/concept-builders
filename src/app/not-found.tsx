"use client";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
              404
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Page Not Found
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for. It might have
              been moved or deleted.
            </p>
            <div className="mt-4 flex items-center gap-4">
              {/* Primary button */}
              <Link
                href="/"
                className="flex items-center justify-center rounded-md h-11 px-5 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-bold shadow-sm hover:from-blue-700 hover:to-cyan-500 transition-all"
              >
                Go to Homepage
              </Link>
              {/* Secondary button */}
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-md h-11 px-5 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-sm font-bold shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Right section - Illustration */}
          <div className="flex justify-center">
            <img
              alt="Illustration of a lost page"
              className="rounded-lg object-cover w-full max-w-sm h-auto shadow-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQv8C5M0nsiiF8KYyiPQBm-cFN80mVBTcZxukVJIGX6yN0qBYrQJ10JaVm5m9Z9mCHJ446JDo4oiL7Eumtx8URpFsvvLQYabqyOFhiD9vzDJ_gYAH8fLJJGvL9AotJusXyM2MNi7s6avkQYquvWTZ4tuNoV9gancbILY_3x1wuc8WGNRLTWfzq1Tx0QKfXYMtmrgO24e9x0YzkANSWo2dKUVChrWjgXXIzIuF6oipI0iNkBDtjs-rePulzQ1RpD8TI2o25EiER7uMj"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
