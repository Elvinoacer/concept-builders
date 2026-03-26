"use client";
import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminHeader from "@/components/admin/dashboard/AdminHeader";
import React, { useState, useEffect } from "react";
import { UploadProvider } from "@/contexts/UploadContext";
import GlobalUploadStatus from "@/components/admin/designs/GlobalUploadStatus";
import { ThemeProvider } from "@/components/theme-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices and auto-manage sidebar states
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // On mobile, close desktop sidebar and ensure mobile sidebar is closed initially
        setIsDesktopSidebarOpen(false);
      } else {
        // On desktop, ensure mobile sidebar is closed
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const id = "material-symbols-outlined-font";
    if (document.getElementById(id)) {
      return;
    }

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";
    document.head.appendChild(link);
  }, []);

  // Close mobile sidebar when clicking on main content
  const handleMainContentClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="concept-builders-theme"
    >
      <UploadProvider>
        <div
          className={`flex h-screen w-full bg-gray-50 dark:bg-gray-900 group/design-root overflow-hidden transition-all duration-300 ease-linear ${
            isDesktopSidebarOpen && !isMobile ? "pl-0" : "pl-0"
          }`}
          onClick={handleMainContentClick}
        >
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
            isMobile={isMobile}
          />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
            <AdminHeader
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              isDesktopSidebarOpen={isDesktopSidebarOpen}
              setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
              isMobile={isMobile}
            />

            <main className="flex-1 overflow-y-auto p-3 min-[375px]:p-4 sm:p-5 md:p-6 lg:p-8 w-full">
              <div className="w-full max-w-full mx-auto">{children}</div>
            </main>
          </div>
          <GlobalUploadStatus />
        </div>
      </UploadProvider>
    </ThemeProvider>
  );
}
