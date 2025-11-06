"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SystemRequirementsPage = () => {
  const router = useRouter();

  const handleContactSupportClick = () => {
    router.push("/dashboard/help");
  };

  const sections = [
    {
      id: "os",
      icon: "computer",
      title: "Operating System",
      content: [
        "**Minimum:** Windows 10 (64-bit), macOS 10.15 (Catalina), or a recent Linux distribution.",
        "**Recommended:** Latest version of Windows, macOS, or Linux for best compatibility and security updates.",
      ],
    },
    {
      id: "cpu",
      icon: "memory",
      title: "Processor (CPU)",
      content: [
        "**Minimum:** Dual-core processor (2.0 GHz or faster).",
        "**Recommended:** Quad-core processor (2.5 GHz or faster) or equivalent.",
      ],
    },
    {
      id: "ram",
      icon: "sd_card",
      title: "Memory (RAM)",
      content: [
        "**Minimum:** 8 GB RAM.",
        "**Recommended:** 16 GB RAM or more for complex projects and multitasking.",
      ],
    },
    {
      id: "gpu",
      icon: "videogame_asset",
      title: "Graphics Card (GPU)",
      content: [
        "**Minimum:** Integrated graphics with support for OpenGL 3.3 or DirectX 11.",
        "**Recommended:** Dedicated graphics card with 2 GB VRAM or more, supporting OpenGL 4.1 or DirectX 12.",
      ],
    },
    {
      id: "storage",
      icon: "hard_drive",
      title: "Storage",
      content: [
        "**Minimum:** 5 GB free disk space for installation.",
        "**Recommended:** SSD (Solid State Drive) with at least 20 GB free space for faster loading times and project storage.",
      ],
    },
    {
      id: "internet",
      icon: "wifi",
      title: "Internet Connection",
      content: [
        "**Minimum:** Broadband internet connection (for cloud features, updates, and asset downloads).",
        "**Recommended:** High-speed broadband for seamless cloud synchronization and collaboration.",
      ],
    },
    {
      id: "display",
      icon: "monitor",
      title: "Display",
      content: [
        "**Minimum:** 1280x800 resolution.",
        "**Recommended:** 1920x1080 (Full HD) or higher resolution.",
      ],
    },
    {
      id: "browser",
      icon: "web",
      title: "Web Browser",
      content: [
        "**Recommended:** Latest versions of Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari for optimal web application performance.",
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
                  System Requirements
                </h1>
                {/* Responsive Body Text */}
                <p className="text-subtle-light dark:text-subtle-dark text-base sm:text-lg lg:text-xl font-normal leading-relaxed sm:leading-normal max-w-[800px]">
                  Review the minimum and recommended system specifications for
                  optimal performance with Concept Builders.
                </p>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="w-full mb-12 sm:mb-16">
            <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
              {/* Requirements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
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
                      <ul className="space-y-2 sm:space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base leading-relaxed"
                          >
                            {item.startsWith("**Minimum:**") ? (
                              <div className="flex items-start gap-2">
                                <span className="text-red-400 font-semibold flex-shrink-0 mt-0.5">
                                  Min:
                                </span>
                                <span className="flex-1 min-w-0">
                                  {item.replace("**Minimum:**", "").trim()}
                                </span>
                              </div>
                            ) : item.startsWith("**Recommended:**") ? (
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 font-semibold flex-shrink-0 mt-0.5">
                                  Rec:
                                </span>
                                <span className="flex-1 min-w-0">
                                  {item.replace("**Recommended:**", "").trim()}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <span className="text-blue-400 font-semibold flex-shrink-0 mt-0.5">
                                  Info:
                                </span>
                                <span className="flex-1 min-w-0">
                                  {item.replace(/\*\*/g, "").trim()}
                                </span>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Support Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-4 sm:gap-6"
              >
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/20 text-primary aspect-square">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                    support_agent
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <h2 className="text-text-light dark:text-text-dark text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">
                    Still have questions about system requirements?
                  </h2>
                  <p className="text-subtle-light dark:text-subtle-dark text-sm sm:text-base font-normal leading-relaxed sm:leading-normal max-w-xl mx-auto px-4">
                    If you're unsure about your system's compatibility or need
                    further assistance, our support team is here to help.
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

export default SystemRequirementsPage;
