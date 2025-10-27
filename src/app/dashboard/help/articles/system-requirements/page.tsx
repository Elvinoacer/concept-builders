'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const SystemRequirementsPage = () => {
  const router = useRouter();

  const handleContactSupportClick = () => {
    router.push('/dashboard/help'); // Link back to the main help page or a specific support contact page
  };

  const sections = [
    {
      id: 'os',
      icon: 'computer',
      title: 'Operating System',
      content: [
        '**Minimum:** Windows 10 (64-bit), macOS 10.15 (Catalina), or a recent Linux distribution.',
        '**Recommended:** Latest version of Windows, macOS, or Linux for best compatibility and security updates.',
      ],
    },
    {
      id: 'cpu',
      icon: 'memory',
      title: 'Processor (CPU)',
      content: [
        '**Minimum:** Dual-core processor (2.0 GHz or faster).',
        '**Recommended:** Quad-core processor (2.5 GHz or faster) or equivalent.',
      ],
    },
    {
      id: 'ram',
      icon: 'sd_card',
      title: 'Memory (RAM)',
      content: [
        '**Minimum:** 8 GB RAM.',
        '**Recommended:** 16 GB RAM or more for complex projects and multitasking.',
      ],
    },
    {
      id: 'gpu',
      icon: 'videogame_asset',
      title: 'Graphics Card (GPU)',
      content: [
        '**Minimum:** Integrated graphics with support for OpenGL 3.3 or DirectX 11.',
        '**Recommended:** Dedicated graphics card with 2 GB VRAM or more, supporting OpenGL 4.1 or DirectX 12.',
      ],
    },
    {
      id: 'storage',
      icon: 'hard_drive',
      title: 'Storage',
      content: [
        '**Minimum:** 5 GB free disk space for installation.',
        '**Recommended:** SSD (Solid State Drive) with at least 20 GB free space for faster loading times and project storage.',
      ],
    },
    {
      id: 'internet',
      icon: 'wifi',
      title: 'Internet Connection',
      content: [
        '**Minimum:** Broadband internet connection (for cloud features, updates, and asset downloads).',
        '**Recommended:** High-speed broadband for seamless cloud synchronization and collaboration.',
      ],
    },
    {
      id: 'display',
      icon: 'monitor',
      title: 'Display',
      content: [
        '**Minimum:** 1280x800 resolution.',
        '**Recommended:** 1920x1080 (Full HD) or higher resolution.',
      ],
    },
    {
      id: 'browser',
      icon: 'web',
      title: 'Web Browser',
      content: [
        '**Recommended:** Latest versions of Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari for optimal web application performance.',
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
                    <p className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">System Requirements</p>
                    <p className="text-subtle-light dark:text-subtle-dark text-lg font-normal leading-normal">
                      Review the minimum and recommended system specifications for optimal performance with Concept Builders.
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
                    <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">Still have questions about system requirements?</h2>
                    <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal max-w-xl mx-auto">
                      If you're unsure about your system's compatibility or need further assistance, our support team is here to help.
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

export default SystemRequirementsPage;
