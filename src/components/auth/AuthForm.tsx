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
    <div className="flex w-full max-w-xs overflow-hidden border border-cb-border bg-card/90 shadow-2xl backdrop-blur-xl xs:max-w-sm sm:max-w-md md:max-w-4xl">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="relative hidden w-1/2 border-r border-cb-border md:flex md:items-center md:justify-center md:p-8 lg:p-10 xl:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_58%_at_80%_5%,rgba(200,137,42,0.2),transparent_62%),radial-gradient(ellipse_44%_34%_at_20%_35%,rgba(200,137,42,0.09),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:78px_78px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.52)_18%,rgba(0,0,0,0.52)_82%,transparent)]" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <Image
            src="/images/concept-builders-logo-free-bg.webp"
            alt="Concept Builders Logo"
            width={160}
            height={160}
            className="mb-4 lg:mb-6 w-24 h-24 lg:w-32 lg:h-32"
            priority
          />
          <h1
            className="text-2xl font-light tracking-[0.06em] text-cream lg:text-3xl xl:text-4xl"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Concept Builders
          </h1>
          <p className="mt-2 max-w-xs text-sm text-cream-dim lg:mt-3 lg:max-w-sm lg:text-base">
            From blueprint to reality. Your dream home, simplified.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-col h-full justify-center">
          {verifiedBanner && (
            <div
              className="mb-4 rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-2 text-xs text-emerald-300 xs:text-sm"
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
          <p className="mt-4 text-center text-xs text-cream-dim xs:mt-5 xs:text-sm sm:mt-6">
            Having trouble?{" "}
            <a
              href="/contact"
              className="ml-1 font-medium text-gold transition-colors duration-300 hover:text-gold-light"
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
