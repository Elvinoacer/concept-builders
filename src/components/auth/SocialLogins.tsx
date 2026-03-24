"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const SocialLogins = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSignIn = async (provider: string) => {
    const referral =
      searchParams.get("referral") ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("referral")
        : null);

    if (referral) {
      try {
        await fetch("/api/auth/set-referral", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ referral }),
        });
      } catch {
        // Continue sign-in flow even if referral cookie setup fails.
      }
    }

    signIn(provider, { callbackUrl });
  };

  return (
    <div>
      {/* Divider */}
      <div className="relative my-4 xs:my-5 sm:my-6 md:my-7">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 xs:px-3 text-xs xs:text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4">
        {/* Google Button */}
        <button
          onClick={() => handleSignIn("google")}
          className="flex items-center justify-center w-full rounded-lg xs:rounded-xl border border-gray-300 bg-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 text-xs xs:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 xs:focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-500"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 xs:h-5 xs:w-5 mr-1.5 xs:mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
          </svg>
          <span className="truncate">Google</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogins;
