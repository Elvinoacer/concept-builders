"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const TroubleshootingPage = () => {
  const router = useRouter();

  const handleContactSupportClick = () => {
    router.push("/dashboard/help");
  };

  const sections = [
    {
      id: "login-issues",
      icon: "login",
      title: "Login Issues",
      content: [
        { type: "problem", text: "Cannot log in, incorrect password." },
        {
          type: "solution",
          text: "Double-check your email address and password for typos.",
        },
        {
          type: "solution",
          text: 'Use the "Forgot Password?" link on the login page to reset your password.',
        },
        {
          type: "solution",
          text: "Ensure your account is not locked or suspended (contact support if you suspect this).",
        },
      ],
    },
    {
      id: "performance-issues",
      icon: "speed",
      title: "Page Loading Errors / Slow Performance",
      content: [
        {
          type: "problem",
          text: "Pages are not loading correctly, or the application is slow.",
        },
        {
          type: "solution",
          text: "Clear Browser Cache: Clear your browser's cache and cookies",
        },
        {
          type: "solution",
          text: "Check Internet Connection: Ensure you have a stable and fast internet connection.",
        },
        {
          type: "solution",
          text: "Try a Different Browser: Test if the issue persists in another supported web browser.",
        },
        {
          type: "solution",
          text: "Review System Requirements: Verify your system meets the minimum requirements for Concept Builders.",
        },
      ],
    },
    {
      id: "editor-problems",
      icon: "palette",
      title: "Design Editor Problems",
      content: [
        {
          type: "problem",
          text: "Tools are unresponsive, elements are not saving, or unexpected behavior.",
        },
        {
          type: "solution",
          text: "Refresh the Page: A simple page refresh can often resolve temporary glitches.",
        },
        {
          type: "solution",
          text: "Check for Updates: Ensure your browser is up to date.",
        },
        {
          type: "solution",
          text: "Disable Browser Extensions: Temporarily disable browser extensions that might interfere with the editor.",
        },
        {
          type: "solution",
          text: "Save Frequently: Save your work often to prevent data loss.",
        },
      ],
    },
    {
      id: "download-issues",
      icon: "download",
      title: "Download Issues",
      content: [
        { type: "problem", text: "Unable to download purchased design files." },
        {
          type: "solution",
          text: "Check Internet Connection: Ensure your internet connection is stable.",
        },
        {
          type: "solution",
          text: 'Verify Purchase: Confirm the design appears in your "My Purchases" section on the dashboard.',
        },
        {
          type: "solution",
          text: "Browser Settings: Check your browser's download settings and ensure pop-ups are not blocked for Concept Builders.",
        },
        {
          type: "solution",
          text: "Contact Support: If the issue persists, our support team can provide direct download links.",
        },
      ],
    },
    {
      id: "general-errors",
      icon: "error",
      title: "General Application Errors",
      content: [
        {
          type: "problem",
          text: "Seeing generic error messages or unexpected crashes.",
        },
        {
          type: "solution",
          text: "Note the Error Message: Take a screenshot or write down the exact error message.",
        },
        {
          type: "solution",
          text: "Reproduce the Issue: Try to identify the steps that lead to the error.",
        },
        {
          type: "solution",
          text: "Contact Support: Provide the error message and steps to reproduce to our support team for a quicker resolution.",
        },
      ],
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Fluid Container with Progressive Padding */}
      <div className="w-full px-4 min-[375px]:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-40">
        {/* Content Container with Optimal Reading Width */}
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
                  Troubleshooting
                </h1>
                {/* Responsive Body Text */}
                <p className="text-subtle-light dark:text-subtle-dark text-base sm:text-lg lg:text-xl font-normal leading-relaxed sm:leading-normal max-w-[800px]">
                  Encountering a problem? This guide provides solutions to
                  common issues you might face while using Concept Builders.
                </p>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="w-full mb-12 sm:mb-16">
            <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
              {/* Troubleshooting Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 min-w-0"
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                          {section.icon}
                        </span>
                      </div>
                      <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl font-bold leading-tight flex-1 min-w-0">
                        {section.title}
                      </h3>
                    </div>

                    {/* Section Content */}
                    <div className="flex-1">
                      <div className="space-y-3 sm:space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`flex items-start gap-3 ${
                              item.type === "problem"
                                ? "pb-2 border-b border-border-light dark:border-border-dark"
                                : ""
                            }`}
                          >
                            {/* Problem/Solution Indicator */}
                            <div
                              className={`flex-shrink-0 mt-0.5 w-2 h-2 rounded-full ${
                                item.type === "problem"
                                  ? "bg-red-400"
                                  : "bg-green-400"
                              }`}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm sm:text-base leading-relaxed ${
                                  item.type === "problem"
                                    ? "text-red-600 dark:text-red-400 font-semibold"
                                    : "text-subtle-light dark:text-subtle-dark"
                                }`}
                              >
                                {item.text.includes(":") ? (
                                  <>
                                    <span className="font-semibold text-text-light dark:text-text-dark">
                                      {item.text.split(":")[0]}:
                                    </span>
                                    {item.text.split(":")[1]}
                                  </>
                                ) : (
                                  item.text
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Support Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-4 sm:gap-6"
              >
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                    support_agent
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <h2 className="text-text-light dark:text-text-dark text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">
                    Still need help?
                  </h2>
                  <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base font-normal leading-relaxed sm:leading-normal max-w-xl mx-auto px-4">
                    If you're unable to resolve your issue, our dedicated
                    support team is ready to assist you.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContactSupportClick}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all hover:opacity-90 min-w-[160px] sm:min-w-[180px]"
                >
                  Contact Support
                  <span className="material-symbols-outlined text-lg sm:text-xl">
                    arrow_forward
                  </span>
                </motion.button>
              </motion.div>
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

export default TroubleshootingPage;
