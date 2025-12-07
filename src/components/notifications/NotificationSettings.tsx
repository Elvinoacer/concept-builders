"use client";

import { useNotificationToken } from "@/hooks/useNotificationToken";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const NotificationSettings = () => {
  const { permission, requestPermission, token, removeTokenFromBackend } = useNotificationToken();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(permission === "granted");
  }, [permission]);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      const token = await requestPermission();
      if (token) {
        setIsEnabled(true);
        toast.success("Notifications enabled");
      } else {
        setIsEnabled(false);
        toast.error("Permission denied. Please enable notifications in your browser settings.");
      }
    } else {
      // We can't revoke browser permission programmatically, but we can remove the token from our backend
      // so we stop sending notifications to this device.
      if (token) {
        await removeTokenFromBackend(token);
      }
      setIsEnabled(false);
      toast.success("Notifications disabled for this device");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-2.5 rounded-lg">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Receive updates about your projects and account
          </p>
        </div>
      </div>
      <Switch
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
};
