'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const TroubleshootingPage = () => {
  const router = useRouter();

  const handleContactSupportClick = () => {
    router.push('/dashboard/help'); // Link back to the main help page or a specific support contact page
  };

  const sections = [
    {
      id: 'login-issues',
      icon: 'login',
      title: 'Login Issues',
      content: [
        '<strong>Problem:</strong> Cannot log in, incorrect password.',
        '<strong>Solution:</strong>',
        'Double-check your email address and password for typos.',
        'Use the "Forgot Password?" link on the login page to reset your password.',
        'Ensure your account is not locked or suspended (contact support if you suspect this).',
      ],
    },
    {
      id: 'performance-issues',
      icon: 'speed',
      title: 'Page Loading Errors / Slow Performance',
      content: [
        '<strong>Problem:</strong> Pages are not loading correctly, or the application is slow.',
        '<strong>Solution:</strong>',
        '<strong>Clear Browser Cache:</strong> Clear your browser\'s cache and cookies',
        '<strong>Check Internet Connection:</strong> Ensure you have a stable and fast internet connection.',
        '<strong>Try a Different Browser:</strong> Test if the issue persists in another supported web browser.',
        '<strong>Review System Requirements:</strong> Verify your system meets the minimum requirements for Concept Builders.',
      ],
    },
    {
      id: 'editor-problems',
      icon: 'palette',
      title: 'Design Editor Problems',
      content: [
        '<strong>Problem:</strong> Tools are unresponsive, elements are not saving, or unexpected behavior.',
        '<strong>Solution:</strong>',
        '<strong>Refresh the Page:</strong> A simple page refresh can often resolve temporary glitches.',
        '<strong>Check for Updates:</strong> Ensure your browser is up to date.',
        '<strong>Disable Browser Extensions:</strong> Temporarily disable browser extensions that might interfere with the editor.',
        '<strong>Save Frequently:</strong> Save your work often to prevent data loss.',
      ],
    },
    {
      id: 'download-issues',
      icon: 'download',
      title: 'Download Issues',
      content: [
        '<strong>Problem:</strong> Unable to download purchased design files.',
        '<strong>Solution:</strong>',
        '<strong>Check Internet Connection:</strong> Ensure your internet connection is stable.',
        '<strong>Verify Purchase:</strong> Confirm the design appears in your "My Purchases" section on the dashboard.',
        '<strong>Browser Settings:</strong> Check your browser\'s download settings and ensure pop-ups are not blocked for Concept Builders.',
        '<strong>Contact Support:</strong> If the issue persists, our support team can provide direct download links.',
      ],
    },
    {
      id: 'general-errors',
      icon: 'error',
      title: 'General Application Errors',
      content: [
        '<strong>Problem:</strong> Seeing generic error messages or unexpected crashes.',
        '<strong>Solution:</strong>',
        '<strong>Note the Error Message:</strong> Take a screenshot or write down the exact error message.',
        '<strong>Reproduce the Issue:</strong> Try to identify the steps that lead to the error.',
        '<strong>Contact Support:</strong> Provide the error message and steps to reproduce to our support team for a quicker resolution.',
      ],
    },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <main className="mt-8">
              <div className="flex flex-col gap-12">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">Troubleshooting</p>
                    <p className="text-subtle-light dark:text-subtle-dark text-lg font-normal leading-normal">
                      Encountering a problem? This guide provides solutions to common issues you might face while using Concept Builders.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                          <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                            {section.icon}
                          </span>
                        </div>
                        <h3 className="text-text-light dark:text-text-dark text-xl font-bold">{section.title}</h3>
                      </div>
                      <ul className="list-disc pl-5 text-subtle-light dark:text-subtle-dark text-base leading-relaxed space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-8 flex flex-col items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                    <span className="material-symbols-outlined text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">support_agent</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">Still need help?</h2>
                    <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal max-w-xl mx-auto">
                      If you're unable to resolve your issue, our dedicated support team is ready to assist you.
                    </p>
                  </div>
                  <button
                    onClick={handleContactSupportClick}
                    className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-base font-semibold text-white transition-all hover:opacity-90"
                  >
                    Contact Support
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </main>
            <footer className="mt-12 text-center text-subtle-light dark:text-subtle-dark text-sm py-4">
              <p>© {new Date().getFullYear()} Concept Builders. All Rights Reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingPage;
