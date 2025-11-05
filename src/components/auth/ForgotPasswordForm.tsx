"use client";
import React, { useState } from "react";

const ForgotPasswordForm = ({
  setAuthMode,
}: {
  setAuthMode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message ||
            "If an account with that email exists, a password reset link has been sent."
        );
      } else {
        setError(data.message || "Failed to send password reset link.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
        Forgot your password?
      </h2>
      <p className="text-gray-600 text-sm xs:text-base mt-2 mb-4 xs:mb-5 sm:mb-6 md:mb-8 dark:text-gray-400 leading-relaxed">
        No problem! Enter your email address below and we&apos;ll send you a
        link to reset it.
      </p>
      <form
        className="flex flex-col gap-3 xs:gap-4 sm:gap-5"
        onSubmit={handleSubmit}
      >
        {/* Success Message */}
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg text-xs xs:text-sm leading-relaxed mb-2 xs:mb-3"
            role="alert"
          >
            <span className="block">{message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg text-xs xs:text-sm leading-relaxed mb-2 xs:mb-3"
            role="alert"
          >
            <span className="block">{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div>
          <label
            className="block text-sm xs:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm xs:text-base h-11 xs:h-12 px-3 xs:px-4 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          className="flex w-full justify-center items-center rounded-lg xs:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-2.5 xs:py-3 sm:py-3.5 px-4 text-sm xs:text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Sending...
            </span>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      {/* Back to Login Link */}
      <p className="mt-6 xs:mt-7 sm:mt-8 text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400">
        Remember your password?{" "}
        <button
          onClick={() => setAuthMode("login")}
          className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 ml-1 transition-all duration-300"
          type="button"
          disabled={loading}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
