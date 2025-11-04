"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialLogins from "./SocialLogins";
import ForgotPasswordForm from "./ForgotPasswordForm";
import EmailVerificationForm from "./EmailVerificationForm";

const AuthForm = () => {
  const [authMode, setAuthMode] = useState("login");
  const [signupEmail, setSignupEmail] = useState("");

  const handleSignupSuccess = (email: string) => {
    setSignupEmail(email);
    setAuthMode("emailVerification");
  };

  const renderForm = () => {
    switch (authMode) {
      case "login":
        return <LoginForm setAuthMode={setAuthMode} />;
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
        return <LoginForm setAuthMode={setAuthMode} />;
    }
  };

  return (
    <div className="flex w-full max-w-sm md:max-w-4xl rounded-xl bg-white shadow-lg overflow-hidden dark:bg-gray-800">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100 p-12 dark:bg-gray-900">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/concept-builders-logo-free-bg.png"
            alt="Concept Builders Logo"
            width={200}
            height={200}
            className="mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
            Concept Builders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            From blueprint to reality. Your dream home, simplified.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-12">
        <div className="flex flex-col h-full justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {renderForm()}
            </motion.div>
          </AnimatePresence>
          {authMode !== "emailVerification" && <SocialLogins />}
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Having trouble?{" "}
            <a
              href="/contact"
              className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 ml-1"
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
