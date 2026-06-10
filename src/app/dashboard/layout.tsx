"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SearchProvider } from "@/lib/SearchContext";
// removed ThemeProvider

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  // Detect mobile devices and auto-close sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
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

  return (
    <SearchProvider>
      {/* Using flex instead of grid for better alignment control */}
      <div className="flex h-screen w-full bg-ink overflow-hidden">
        {/* Sidebar */}
        <div
          className="h-full flex-shrink-0 transition-all duration-300 ease-in-out"
          style={{
            width: isSidebarOpen && !isMobile ? sidebarWidth : 0,
            minWidth: isSidebarOpen && !isMobile ? sidebarWidth : 0,
          }}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isMobile={isMobile}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
          />
        </div>

        {/* Main Content Area - This will now sit flush against the sidebar */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />

          <main className="flex-1 overflow-hidden bg-ink">
            <div className="h-full w-full p-4 md:p-6 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </SearchProvider>
  );
}
