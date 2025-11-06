"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AccountSetupGuidePage = () => {
  const router = useRouter();

  const handleGoToDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Main Container with Fluid Padding */}
      <div className="w-full px-4 min-[375px]:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-40">
        {/* Content Container with Max Width */}
        <div className="w-full max-w-[1200px] mx-auto py-4 sm:py-6 md:py-8">
          {/* Header Section */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-8 sm:mb-12 md:mb-16"
          >
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
                {/* Fluid Typography Scale */}
                <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.02em] sm:tracking-[-0.033em] bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text break-words">
                  Account Setup Guide
                </h1>
                {/* Responsive Text Sizing */}
                <p className="text-subtle-light dark:text-subtle-dark text-base sm:text-lg lg:text-xl font-normal leading-relaxed sm:leading-normal max-w-[800px]">
                  This guide will walk you through setting up your account to
                  ensure you have full access to all our features and services.
                </p>
              </div>
            </div>
          </motion.header>

          {/* Steps Section */}
          <main className="w-full mb-12 sm:mb-16">
            <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
              {/* Steps Container */}
              <div className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12">
                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10">
                  {/* Step 1 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        person_add
                      </span>
                    </div>
                    <div className="hidden sm:block w-[2px] sm:h-16 md:h-20 bg-border-light dark:border-border-dark mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 1
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Sign Up or Log In
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      If you haven't already, sign up for a new account using
                      your email address or log in with your existing
                      credentials. You can also use supported social login
                      options for a quicker setup.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        account_circle
                      </span>
                    </div>
                    <div className="hidden sm:block w-[2px] sm:h-16 md:h-20 bg-border-light dark:border-border-dark mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 2
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Complete Your Profile Information
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      Once logged in, navigate to your "Profile" or "Account
                      Settings" section. Here, you can: Update Personal Details,
                      Set Profile Picture, and Change Password.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        notifications
                      </span>
                    </div>
                    <div className="hidden sm:block w-[2px] sm:h-16 md:h-20 bg-border-light dark:border-border-dark mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 3
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Configure Notification Preferences
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      In your account settings, look for a "Notifications"
                      section. You can customize how you receive updates from
                      Concept Builders, such as: Email Notifications and In-App
                      Notifications.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        payment
                      </span>
                    </div>
                    <div className="hidden sm:block w-[2px] sm:h-16 md:h-20 bg-border-light dark:border-border-dark mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 4
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Set Up Payment Methods (Optional)
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      If you plan to purchase designs or subscribe to premium
                      features, navigate to the "Billing" or "Payment Methods"
                      section. You can securely add and manage your preferred
                      payment options, such as credit/debit cards or other
                      supported payment gateways.
                    </p>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        dashboard
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 5
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Explore Your Dashboard
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      With your account fully set up, take some time to explore
                      your main dashboard. Familiarize yourself with: Projects,
                      Purchases, and Feedback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Congratulations Section */}
              <div className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-4 sm:gap-6">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                    celebration
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <h2 className="text-text-light dark:text-text-dark text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">
                    Congratulations! Your account is set up.
                  </h2>
                  <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base font-normal leading-relaxed sm:leading-normal max-w-xl mx-auto px-4">
                    You're ready to start exploring designs, initiating
                    projects, and bringing your architectural visions to life.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoToDashboardClick}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all hover:opacity-90 min-w-[160px] sm:min-w-[180px]"
                >
                  Go to Dashboard
                  <span className="material-symbols-outlined text-lg sm:text-xl">
                    arrow_forward
                  </span>
                </motion.button>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center text-subtle-light dark:text-subtle-dark text-xs sm:text-sm py-4 sm:py-6 border-t border-border-light dark:border-border-dark">
            <p>
              © {new Date().getFullYear()} Concept Builders. All Rights
              Reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AccountSetupGuidePage;
