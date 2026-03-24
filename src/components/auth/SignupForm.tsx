"use client";
import React, { useState } from "react";

interface SignupFormProps {
  setAuthMode: React.Dispatch<React.SetStateAction<string>>;
  onSignupSuccess: (email: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  setAuthMode,
  onSignupSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string): string | null => {
    if (value.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(value))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value))
      return "Password must contain at least one number";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
      } else {
        onSignupSuccess(email); // Call the callback with the email
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
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
        Create an Account
      </h2>
      <p className="mb-4 mt-2 text-sm text-cream-dim xs:mb-5 xs:text-base sm:mb-6 md:mb-8">
        Get started with a free account.
      </p>
      <form
        className="flex flex-col gap-3 xs:gap-4 sm:gap-5"
        onSubmit={handleSubmit}
      >
        {error && (
          <div
            className="rounded-lg border border-red-700/45 bg-red-900/20 px-3 py-2.5 text-xs leading-relaxed text-red-300 xs:px-4 xs:py-3 xs:text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Name Input */}
        <div>
          <label
            className="mb-1 block text-sm font-medium text-cream xs:mb-2 xs:text-base"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="h-11 w-full rounded-lg border border-cb-border bg-surface px-3 text-sm text-cream shadow-sm transition-colors duration-200 placeholder:text-cb-muted focus:border-gold focus:ring-2 focus:ring-gold/20 xs:h-12 xs:px-4 xs:text-base"
            id="name"
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

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
          <label
            className="mb-1 block text-sm font-medium text-cream xs:mb-2 xs:text-base"
            htmlFor="password"
          >
            Password
            <span className="ml-1 text-xs text-cb-muted">
              (min. 8, include uppercase + number)
            </span>
          </label>
          <div className="relative">
            <input
              className="h-11 w-full rounded-lg border border-cb-border bg-surface px-3 pr-10 text-sm text-cream shadow-sm transition-colors duration-200 placeholder:text-cb-muted focus:border-gold focus:ring-2 focus:ring-gold/20 xs:h-12 xs:px-4 xs:pr-12 xs:text-base"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-0 flex items-center px-3 text-cb-muted transition-colors hover:text-gold xs:px-4"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-lg xs:text-xl">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {password.length > 0 && validatePassword(password) && (
            <p className="mt-1 text-xs text-red-300">
              {validatePassword(password)}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="flex w-full items-center justify-center rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg xs:rounded-xl xs:py-3 xs:text-base sm:py-3.5"
          type="submit"
          disabled={loading || !!validatePassword(password)}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Signing up...
            </span>
          ) : (
            "Sign up"
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-xs text-cream-dim xs:mt-7 xs:text-sm sm:mt-8">
        Already have an account?{" "}
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

export default SignupForm;
