"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Password reset token is missing.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!token) {
      setError("Password reset token is missing.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message ||
            "Your password has been reset successfully. You can now log in."
        );
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-3 py-8 sm:px-4 sm:py-12 lg:px-8">
      {/* Fluid container with max-width constraints */}
      <div className="w-full max-w-[90vw] sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl space-y-6 sm:space-y-8 rounded-xl bg-white p-6 sm:p-8 lg:p-10 shadow-lg dark:bg-gray-800">
        {/* Logo Section */}
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4">
            <Image
              src="/images/concept-builders-logo-free-bg.png"
              alt="Concept Builders Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
              priority
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Reset Your Password
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose mx-auto">
            Enter your new password below.
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Status Messages */}
          {(message || error) && (
            <div
              className={`${
                message
                  ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
                  : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
              } rounded-lg p-3 sm:p-4 text-sm sm:text-base`}
              role="alert"
            >
              <span className="block text-center sm:text-left">
                {message || error}
              </span>
            </div>
          )}

          {/* Password Fields */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-base sm:text-sm lg:text-base h-12 sm:h-14 px-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 placeholder:text-gray-500 transition-colors duration-200"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-base sm:text-sm lg:text-base h-12 sm:h-14 px-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 placeholder:text-gray-500 transition-colors duration-200"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 py-3 sm:py-4 px-4 text-sm sm:text-base font-medium text-white hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 min-h-[3rem] sm:min-h-[3.5rem]"
              disabled={loading}
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Additional Help Text */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4 sm:mt-6">
            Remember your password?{" "}
            <button
              onClick={() => router.push("/auth")}
              className="text-blue-600 hover:text-blue-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium transition-colors duration-200 focus:outline-none focus:underline"
            >
              Back to login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
