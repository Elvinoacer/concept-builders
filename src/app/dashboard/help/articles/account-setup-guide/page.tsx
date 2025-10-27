'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const AccountSetupGuidePage = () => {
  const router = useRouter();

  const handleGoToDashboardClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <main className="mt-8">
              <div className="flex flex-col gap-12">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">Account Setup Guide</p>
                    <p className="text-subtle-light dark:text-subtle-dark text-lg font-normal leading-normal">
                      This guide will walk you through setting up your account to ensure you have full access to all our features and services.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-10 bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 md:p-10">
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">person_add</span>
                      </div>
                      <div className="w-[2px] bg-border-light dark:border-border-dark h-full"></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 1</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Sign Up or Log In</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">If you haven't already, sign up for a new account using your email address or log in with your existing credentials. You can also use supported social login options for a quicker setup.</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">account_circle</span>
                      </div>
                      <div className="w-[2px] bg-border-light dark:border-border-dark h-full"></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 2</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Complete Your Profile Information</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">Once logged in, navigate to your "Profile" or "Account Settings" section. Here, you can: Update Personal Details, Set Profile Picture, and Change Password.</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">notifications</span>
                      </div>
                      <div className="w-[2px] bg-border-light dark:border-border-dark h-full"></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 3</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Configure Notification Preferences</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">In your account settings, look for a "Notifications" section. You can customize how you receive updates from Concept Builders, such as: Email Notifications and In-App Notifications.</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">payment</span>
                      </div>
                      <div className="w-[2px] bg-border-light dark:border-border-dark h-full"></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 4</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Set Up Payment Methods (Optional)</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">If you plan to purchase designs or subscribe to premium features, navigate to the "Billing" or "Payment Methods" section. You can securely add and manage your preferred payment options, such as credit/debit cards or other supported payment gateways.</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">dashboard</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 5</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Explore Your Dashboard</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">With your account fully set up, take some time to explore your main dashboard. Familiarize yourself with: Projects, Purchases, and Feedback.</p>
                    </div>
                  </div>
                </div>
                <div className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-8 flex flex-col items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                    <span className="material-symbols-outlined text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">celebration</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">Congratulations! Your account is set up.</h2>
                    <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal max-w-xl mx-auto">
                      You're ready to start exploring designs, initiating projects, and bringing your architectural visions to life.
                    </p>
                  </div>
                  <button
                    onClick={handleGoToDashboardClick}
                    className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-base font-semibold text-white transition-all hover:opacity-90"
                  >
                    Go to Dashboard
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

export default AccountSetupGuidePage;
