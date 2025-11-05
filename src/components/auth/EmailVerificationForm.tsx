"use client";
import React, { useState } from "react";

interface EmailVerificationFormProps {
  setAuthMode: React.Dispatch<React.SetStateAction<string>>;
  email?: string; // Optional email prop
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  setAuthMode,
  email,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    if (!email) {
      setError("Email not available to resend verification link.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Verification link sent! Please check your inbox.");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to resend verification link.");
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
        Verify your email
      </h2>

      {/* Email Display */}
      {email && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg xs:rounded-xl p-3 xs:p-4 mb-3 xs:mb-4">
          <p className="text-sm xs:text-base text-blue-800 dark:text-blue-200 font-medium">
            Email sent to:
          </p>
          <p className="text-sm xs:text-base text-blue-700 dark:text-blue-300 break-all">
            {email}
          </p>
        </div>
      )}

      <p className="text-gray-600 text-sm xs:text-base mt-2 mb-4 xs:mb-5 sm:mb-6 md:mb-8 dark:text-gray-400 leading-relaxed">
        We&apos;ve sent a verification link to your email address. Please check
        your inbox and click the link to activate your account.
      </p>

      {/* Success Message */}
      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg text-xs xs:text-sm leading-relaxed mb-3 xs:mb-4"
          role="alert"
        >
          <span className="block">{message}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg text-xs xs:text-sm leading-relaxed mb-3 xs:mb-4"
          role="alert"
        >
          <span className="block">{error}</span>
        </div>
      )}

      {/* Resend Button */}
      <button
        className="flex w-full justify-center items-center rounded-lg xs:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-2.5 xs:py-3 sm:py-3.5 px-4 text-sm xs:text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
        type="button"
        onClick={handleResendVerification}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            Sending...
          </span>
        ) : (
          "Resend verification link"
        )}
      </button>

      {/* Login Link */}
      <p className="mt-4 xs:mt-5 sm:mt-6 text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400">
        Already verified?{" "}
        <button
          onClick={() => setAuthMode("login")}
          className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 ml-1 transition-all duration-300"
          type="button"
          disabled={loading}
        >
          Login
        </button>
      </p>

      {/* Additional Help Text */}
      <div className="mt-4 xs:mt-5 p-3 xs:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong>Didn't receive the email?</strong> Check your spam folder or
          make sure you entered the correct email address.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
