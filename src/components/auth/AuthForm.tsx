"use client";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialLogins from "./SocialLogins";
import ForgotPasswordForm from "./ForgotPasswordForm";
import EmailVerificationForm from "./EmailVerificationForm";

const AuthForm = () => {
  const [authMode, setAuthMode] = useState("login");
  const [signupEmail, setSignupEmail] = useState("");
  const [verifiedBanner, setVerifiedBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const isVerified = params.get("verified") === "true";
    if (isVerified) {
      setAuthMode("login");
      setVerifiedBanner(true);
    }
  }, []);

  const handleSignupSuccess = (email: string) => {
    setSignupEmail(email);
    setAuthMode("emailVerification");
  };

  const renderForm = () => {
    switch (authMode) {
      case "login":
        return (
          <Suspense fallback={<div className="h-10" />}>
            <LoginForm setAuthMode={setAuthMode} />
          </Suspense>
        );
      case "signup":
        return (
          <SignupForm
            setAuthMode={setAuthMode}
            onSignupSuccess={handleSignupSuccess}
          />
        );
      case "forgotPassword":
        return <ForgotPasswordForm setAuthMode={setAuthMode} />;
      case "emailVerification":
        return (
          <EmailVerificationForm
            setAuthMode={setAuthMode}
            email={signupEmail}
          />
        );
      default:
        return (
          <Suspense fallback={<div className="h-10" />}>
            <LoginForm setAuthMode={setAuthMode} />
          </Suspense>
        );
    }
  };

  return (
    <div className="flex w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-4xl rounded-lg xs:rounded-xl md:rounded-2xl bg-white shadow-md xs:shadow-lg md:shadow-xl overflow-hidden dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-8 lg:p-10 xl:p-12">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/concept-builders-logo-free-bg.png"
            alt="Concept Builders Logo"
            width={160}
            height={160}
            className="mb-4 lg:mb-6 w-24 h-24 lg:w-32 lg:h-32"
            priority
          />
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
            Concept Builders
          </h1>
          <p className="mt-2 lg:mt-3 text-sm lg:text-base text-gray-600 dark:text-gray-400 max-w-xs lg:max-w-sm">
            From blueprint to reality. Your dream home, simplified.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-col h-full justify-center">
          {verifiedBanner && (
            <div
              className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 xs:text-sm"
              role="status"
            >
              Email verified successfully. You can now log in.
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderForm()}
            </motion.div>
          </AnimatePresence>

          {/* Social Logins - Hidden during email verification */}
          {authMode !== "emailVerification" && (
            <Suspense fallback={null}>
              <SocialLogins />
            </Suspense>
          )}

          {/* Support Link */}
          <p className="mt-4 xs:mt-5 sm:mt-6 text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            Having trouble?{" "}
            <a
              href="/contact"
              className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 ml-1 transition-all duration-300"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
