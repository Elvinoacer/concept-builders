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
            "If an account with that email exists, a password reset link has been sent.",
        );
      } else {
        setError(data.message || "Failed to send password reset link.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2
        className="text-xl font-light leading-tight text-cream xs:text-2xl sm:text-3xl md:text-4xl"
        style={{
          fontFamily:
            'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
        }}
      >
        Forgot your password?
      </h2>
      <p className="mb-4 mt-2 text-sm leading-relaxed text-cream-dim xs:mb-5 xs:text-base sm:mb-6 md:mb-8">
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
            className="mb-2 rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-2.5 text-xs leading-relaxed text-emerald-300 xs:mb-3 xs:px-4 xs:py-3 xs:text-sm"
            role="alert"
          >
            <span className="block">{message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mb-2 rounded-lg border border-red-700/45 bg-red-900/20 px-3 py-2.5 text-xs leading-relaxed text-red-300 xs:mb-3 xs:px-4 xs:py-3 xs:text-sm"
            role="alert"
          >
            <span className="block">{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div>
          <label
            className="mb-1 block text-sm font-medium text-cream xs:mb-2 xs:text-base"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="h-11 w-full rounded-lg border border-cb-border bg-surface px-3 text-sm text-cream shadow-sm transition-colors duration-200 placeholder:text-cb-muted focus:border-gold focus:ring-2 focus:ring-gold/20 xs:h-12 xs:px-4 xs:text-base"
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
          className="flex w-full items-center justify-center rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg xs:rounded-xl xs:py-3 xs:text-base sm:py-3.5"
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
      <p className="mt-6 text-center text-xs text-cream-dim xs:mt-7 xs:text-sm sm:mt-8">
        Remember your password?{" "}
        <button
          onClick={() => setAuthMode("login")}
          className="ml-1 font-medium text-gold transition-colors duration-300 hover:text-gold-light"
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
