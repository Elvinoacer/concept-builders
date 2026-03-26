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
            "Your password has been reset successfully. You can now log in.",
        );
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password.");
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-3 py-8 sm:px-4 sm:py-12 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_56%_at_82%_2%,rgba(200,137,42,0.2),transparent_62%),radial-gradient(ellipse_48%_36%_at_15%_28%,rgba(200,137,42,0.1),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:84px_84px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.55)_18%,rgba(0,0,0,0.55)_82%,transparent)]" />

      {/* Fluid container with max-width constraints */}
      <div className="relative z-10 w-full max-w-[90vw] space-y-6 border border-cb-border bg-card/90 p-6 shadow-2xl backdrop-blur-xl sm:max-w-md sm:space-y-8 sm:p-8 lg:max-w-lg lg:p-10 xl:max-w-xl 2xl:max-w-2xl">
        {/* Logo Section */}
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4">
            <Image
              src="/images/concept-builders-logo-free-bg.webp"
              alt="Concept Builders Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
              priority
            />
          </div>
          <h2
            className="text-2xl font-light leading-tight tracking-tight text-cream sm:text-3xl lg:text-4xl"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Reset Your Password
          </h2>
          <p className="mx-auto mt-2 max-w-prose text-sm leading-relaxed text-cream-dim sm:mt-3 sm:text-base lg:text-lg">
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
                  ? "border border-emerald-700/40 bg-emerald-900/20 text-emerald-300"
                  : "border border-red-700/45 bg-red-900/20 text-red-300"
              } rounded-lg p-3 text-sm sm:p-4 sm:text-base`}
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
                className="h-12 w-full rounded-lg border border-cb-border bg-surface px-4 text-base text-cream shadow-sm transition-colors duration-200 placeholder:text-cb-muted focus:border-gold focus:ring-gold sm:h-14 sm:text-sm lg:text-base"
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
                className="h-12 w-full rounded-lg border border-cb-border bg-surface px-4 text-base text-cream shadow-sm transition-colors duration-200 placeholder:text-cb-muted focus:border-gold focus:ring-gold sm:h-14 sm:text-sm lg:text-base"
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
              className="group relative flex min-h-[3rem] w-full justify-center rounded-lg border border-transparent bg-gold px-4 py-3 text-sm font-medium text-ink transition-all duration-200 hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[3.5rem] sm:py-4 sm:text-base"
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
          <p className="mt-4 text-xs text-cream-dim sm:mt-6 sm:text-sm">
            Remember your password?{" "}
            <button
              onClick={() => router.push("/auth")}
              className="font-medium text-gold transition-colors duration-200 hover:text-gold-light focus:outline-none focus:underline"
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
