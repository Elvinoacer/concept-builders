"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CreatingFirstProjectPage = () => {
  const router = useRouter();

  const handleStartProjectClick = () => {
    router.push("/dashboard/projects");
  };

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
                  Welcome to Concept Builders!
                </h1>
                {/* Responsive Body Text */}
                <p className="text-subtle-light dark:text-subtle-dark text-base sm:text-lg lg:text-xl font-normal leading-relaxed sm:leading-normal max-w-[800px]">
                  Let's walk through creating your first architectural design
                  project. Follow these simple steps to get started.
                </p>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="w-full mb-12 sm:mb-16">
            <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
              {/* Steps Container */}
              <div className="bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12">
                {/* Responsive Grid - Mobile: Stacked, Tablet+: 2-column */}
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10">
                  {/* Step 1 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        dashboard
                      </span>
                    </div>
                    <div className="hidden sm:block w-[2px] sm:h-16 md:h-20 bg-border-light dark:border-border-dark mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 1
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Navigate to Your Projects Dashboard
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      After logging in, navigate to your "Projects" dashboard.
                      This is where you'll see all your initiated projects and
                      track their progress. You can usually find a link to
                      "Projects" in your main navigation or sidebar.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        add_circle
                      </span>
                    </div>
                    <div className="hidden sm:block w-[2px] sm:h-16 md:h-20 bg-border-light dark:border-border-dark mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 2
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Initiate a New Project
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      On your Projects dashboard, look for a prominent button
                      labeled "Initialize New Project," often located in the
                      top-right corner. Click on this button to begin the
                      project initiation process.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        edit_document
                      </span>
                    </div>
                    <div className="hidden sm:block w-[2px] sm:h-16 md:h-20 bg-border-light dark:border-border-dark mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 3
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Provide Initial Project Information
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      You will be redirected to a new page
                      (`/dashboard/projects/new`) where you can provide
                      essential information to kickstart your project. This
                      typically includes: Project Name, Project Type, Location,
                      and a Brief Description.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                        rocket_launch
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                    <p className="text-subtle-light dark:text-subtle-dark text-xs sm:text-sm font-semibold tracking-wide uppercase">
                      Step 4
                    </p>
                    <h3 className="text-text-light dark:text-text-dark text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Confirm and Submit Project Initiation
                    </h3>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed sm:leading-normal">
                      Review all the details you've entered. Once you're
                      satisfied, click the "Create Project" or "Submit" button
                      on the new project page.
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
                    Congratulations on initiating your project!
                  </h2>
                  <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base font-normal leading-relaxed sm:leading-normal max-w-xl mx-auto px-4">
                    Our team will now take over the management of the
                    construction phase. You can return to your Projects
                    dashboard at any time to view updates, track progress, and
                    receive communications from our admin team.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartProjectClick}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all hover:opacity-90 min-w-[160px] sm:min-w-[180px]"
                >
                  Go to Projects Dashboard
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

export default CreatingFirstProjectPage;
