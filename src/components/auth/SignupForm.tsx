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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
        Create an Account
      </h2>
      <p className="text-gray-600 text-sm xs:text-base mt-2 mb-4 xs:mb-5 sm:mb-6 md:mb-8 dark:text-gray-400">
        Get started with a free account.
      </p>
      <form
        className="flex flex-col gap-3 xs:gap-4 sm:gap-5"
        onSubmit={handleSubmit}
      >
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg text-xs xs:text-sm leading-relaxed"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Name Input */}
        <div>
          <label
            className="block text-sm xs:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm xs:text-base h-11 xs:h-12 px-3 xs:px-4 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
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

        {/* Password Input */}
        <div>
          <label
            className="block text-sm xs:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 xs:mb-2"
            htmlFor="password"
          >
            Password
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              (min. 6 characters)
            </span>
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm xs:text-base h-11 xs:h-12 px-3 xs:px-4 pr-10 xs:pr-12 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 xs:px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors top-0"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-lg xs:text-xl">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {password.length > 0 && password.length < 6 && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="flex w-full justify-center items-center rounded-lg xs:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-2.5 xs:py-3 sm:py-3.5 px-4 text-sm xs:text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
          type="submit"
          disabled={loading || password.length < 6}
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
      <p className="mt-6 xs:mt-7 sm:mt-8 text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
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

export default SignupForm;
