"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = ({
  setAuthMode,
}: {
  setAuthMode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleResendVerification = async () => {
    if (!email) {
      setError("Enter your email to resend verification.");
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to resend verification email.");
        return;
      }

      setVerificationMessage(
        data.message ||
          "If this account exists, a verification link has been sent.",
      );
      setShowResendVerification(false);
    } catch {
      setError("Failed to resend verification email.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerificationMessage(null);
    setShowResendVerification(false);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === "EMAIL_NOT_VERIFIED") {
        setError("Please verify your email before logging in.");
        setShowResendVerification(true);
      } else if (
        result.error ===
        "Account created via social login. Please use social login or set a password."
      ) {
        setError(
          "Your account was created using social login. Please use social login or click the 'Forgot password?' link to set a password.",
        );
      } else {
        setError(result.error);
      }
    } else if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
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
        Welcome Back
      </h2>
      <p className="mb-4 mt-2 text-sm text-cream-dim xs:mb-5 xs:text-base sm:mb-6 md:mb-8">
        Login to continue to your account.
      </p>
      <form
        className="flex flex-col gap-3 xs:gap-4 sm:gap-5"
        onSubmit={handleSubmit}
      >
        {verificationMessage && (
          <div
            className="rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-2.5 text-xs leading-relaxed text-emerald-300 xs:px-4 xs:py-3 xs:text-sm"
            role="status"
          >
            {verificationMessage}
          </div>
        )}

        {error && (
          <div
            className="rounded-lg border border-red-700/45 bg-red-900/20 px-3 py-2.5 text-xs leading-relaxed text-red-300 xs:px-4 xs:py-3 xs:text-sm"
            role="alert"
          >
            {error.includes("social login") ? (
              <span className="block">
                {error.split("click")[0]}
                <button
                  type="button"
                  onClick={() => setAuthMode("forgotPassword")}
                  className="ml-1 font-medium text-gold underline transition-colors hover:text-gold-light"
                >
                  here
                </button>
                {error.split("click")[1]}
              </span>
            ) : (
              error
            )}
          </div>
        )}

        {showResendVerification && (
          <button
            type="button"
            onClick={handleResendVerification}
            className="self-start text-xs font-medium text-gold underline transition-colors hover:text-gold-light xs:text-sm"
            disabled={loading}
          >
            Resend verification email
          </button>
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

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-1 xs:mb-2">
            <label
              className="block text-sm font-medium text-cream xs:text-base"
              htmlFor="password"
            >
              Password
            </label>
            <button
              onClick={() => setAuthMode("forgotPassword")}
              className="text-xs font-medium text-gold transition-colors duration-300 hover:text-gold-light xs:text-sm"
              type="button"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              className="h-11 w-full rounded-lg border border-cb-border bg-surface px-3 pr-10 text-sm text-cream shadow-sm transition-colors duration-200 placeholder:text-cb-muted focus:border-gold focus:ring-2 focus:ring-gold/20 xs:h-12 xs:px-4 xs:pr-12 xs:text-base"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-cb-muted transition-colors hover:text-gold xs:px-4"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-lg xs:text-xl">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
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
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-6 text-center text-xs text-cream-dim xs:mt-7 xs:text-sm sm:mt-8">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => setAuthMode("signup")}
          className="ml-1 font-medium text-gold transition-colors duration-300 hover:text-gold-light"
          type="button"
          disabled={loading}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
