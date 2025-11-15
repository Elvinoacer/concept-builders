"use client";

import { useEffect } from "react";

interface DesignViewTrackerProps {
  designId: string;
}

export const DesignViewTracker = ({ designId }: DesignViewTrackerProps) => {
  useEffect(() => {
    if (designId) {
      const trackView = async () => {
        try {
          await fetch(`/api/designs/${designId}/view`, {
            method: "POST",
          });
        } catch (error) {
          console.error("Error tracking design view:", error);
        }
      };
      trackView();
    }
  }, [designId]);

  return null;
};
