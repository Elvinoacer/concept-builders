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
        Verify your email
      </h2>

      {/* Email Display */}
      {email && (
        <div className="mb-3 rounded-lg border border-gold/30 bg-gold/10 p-3 xs:mb-4 xs:rounded-xl xs:p-4">
          <p className="text-sm font-medium text-gold-light xs:text-base">
            Email sent to:
          </p>
          <p className="break-all text-sm text-cream xs:text-base">{email}</p>
        </div>
      )}

      <p className="mb-4 mt-2 text-sm leading-relaxed text-cream-dim xs:mb-5 xs:text-base sm:mb-6 md:mb-8">
        We&apos;ve sent a verification link to your email address. Please check
        your inbox and click the link to activate your account.
      </p>

      {/* Success Message */}
      {message && (
        <div
          className="mb-3 rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-2.5 text-xs leading-relaxed text-emerald-300 xs:mb-4 xs:px-4 xs:py-3 xs:text-sm"
          role="alert"
        >
          <span className="block">{message}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mb-3 rounded-lg border border-red-700/45 bg-red-900/20 px-3 py-2.5 text-xs leading-relaxed text-red-300 xs:mb-4 xs:px-4 xs:py-3 xs:text-sm"
          role="alert"
        >
          <span className="block">{error}</span>
        </div>
      )}

      {/* Resend Button */}
      <button
        className="flex w-full items-center justify-center rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg xs:rounded-xl xs:py-3 xs:text-base sm:py-3.5"
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
      <p className="mt-4 text-center text-xs text-cream-dim xs:mt-5 xs:text-sm sm:mt-6">
        Already verified?{" "}
        <button
          onClick={() => setAuthMode("login")}
          className="ml-1 font-medium text-gold transition-colors duration-300 hover:text-gold-light"
          type="button"
          disabled={loading}
        >
          Login
        </button>
      </p>

      {/* Additional Help Text */}
      <div className="mt-4 rounded-lg border border-cb-border bg-surface p-3 xs:mt-5 xs:rounded-xl xs:p-4">
        <p className="text-xs leading-relaxed text-cream-dim xs:text-sm">
          <strong>Didn't receive the email?</strong> Check your spam folder or
          make sure you entered the correct email address.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
