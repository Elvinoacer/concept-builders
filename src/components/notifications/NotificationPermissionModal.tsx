"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useNotificationToken } from "@/hooks/useNotificationToken";
import { Button } from "@/components/ui/button";

export const NotificationPermissionModal = () => {
  const { permission, requestPermission } = useNotificationToken();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show modal if permission is default (not granted or denied)
    // and we haven't shown it in this session (optional logic, keeping simple for now)
    if (permission === "default") {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Delay showing by 3 seconds
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [permission]);

  const handleAllow = async () => {
    await requestPermission();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 relative">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  Enable Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Stay updated with the latest project updates, design releases, and special offers.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAllow}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
                  >
                    Allow
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleDismiss}
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                  >
                    Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
