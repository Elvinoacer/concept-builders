'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'; // Assuming animations are desired

const CreatingFirstProjectPage = () => {
  const router = useRouter();

  const handleStartProjectClick = () => {
    router.push('/dashboard/projects');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Main content from the provided HTML */}
            <main className="mt-8">
              <div className="flex flex-col gap-12">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">Welcome to Concept Builders!</p>
                    <p className="text-subtle-light dark:text-subtle-dark text-lg font-normal leading-normal">
                      Let's walk through creating your first architectural design project. Follow these simple steps to get started.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-10 bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-6 md:p-10">
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">dashboard</span>
                      </div>
                      <div className="w-[2px] bg-border-light dark:border-border-dark h-full"></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 1</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Navigate to Your Projects Dashboard</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">After logging in, navigate to your "Projects" dashboard. This is where you'll see all your initiated projects and track their progress. You can usually find a link to "Projects" in your main navigation or sidebar.</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">add_circle</span>
                      </div>
                      <div className="w-[2px] bg-border-light dark:border-border-dark h-full"></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 2</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Initiate a New Project</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">On your Projects dashboard, look for a prominent button labeled "Initialize New Project," often located in the top-right corner. Click on this button to begin the project initiation process.</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">edit_document</span>
                      </div>
                      <div className="w-[2px] bg-border-light dark:border-border-dark h-full"></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 3</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Provide Initial Project Information</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">You will be redirected to a new page (`/dashboard/projects/new`) where you can provide essential information to kickstart your project. This typically includes: Project Name, Project Type, Location, and a Brief Description.</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                        <span className="material-symbols-outlined text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">rocket_launch</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <p className="text-subtle-light dark:text-subtle-dark text-sm font-semibold tracking-wide uppercase">Step 4</p>
                      <h3 className="text-text-light dark:text-text-dark text-xl font-bold">Confirm and Submit Project Initiation</h3>
                      <p className="text-subtle-light dark:text-subtle-dark">Review all the details you've entered. Once you're satisfied, click the "Create Project" or "Submit" button on the new project page.</p>
                    </div>
                  </div>
                </div>
                <div className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-xl p-8 flex flex-col items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                    <span className="material-symbols-outlined text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">celebration</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">Congratulations on initiating your project!</h2>
                    <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal max-w-xl mx-auto">
                      Our team will now take over the management of the construction phase. You can return to your Projects dashboard at any time to view updates, track progress, and receive communications from our admin team.
                    </p>
                  </div>
                  <button
                    onClick={handleStartProjectClick}
                    className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-base font-semibold text-white transition-all hover:opacity-90"
                  >
                    Go to Projects Dashboard
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

export default CreatingFirstProjectPage;
