"use client";

import { useEffect } from "react";

interface DesignViewTrackerProps {
  designId: string;
}

export const DesignViewTracker = ({ designId }: DesignViewTrackerProps) => {
  useEffect(() => {
    if (designId) {
      const trackView = async () => {
        const storageKey = `design-view-tracked:${designId}`;

        try {
          const alreadyTracked = localStorage.getItem(storageKey);
          if (alreadyTracked === "1") {
            return;
          }
        } catch {
          // Continue tracking when storage is unavailable.
        }

        try {
          await fetch(`/api/designs/${designId}/view`, {
            method: "POST",
          });

          try {
            localStorage.setItem(storageKey, "1");
          } catch {
            // Ignore storage errors.
          }
        } catch (error) {
          console.error("Error tracking design view:", error);
        }
      };
      trackView();
    }
  }, [designId]);

  return null;
};
