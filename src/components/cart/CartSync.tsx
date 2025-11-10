"use client";

import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

// This component is a singleton that handles the one-time sync of a guest cart to the DB upon login.
export function CartSync() {
  const { status } = useSession();
  const [hasSynced, setHasSynced] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("cartSynced") === "true";
    }
    return false;
  });
  const { syncCart } = useCart();

  const syncGuestCart = useCallback(async () => {
    await syncCart();
    // Mark as synced for this session to prevent re-syncing
    sessionStorage.setItem("cartSynced", "true");
    setHasSynced(true);
  }, [syncCart]);

  useEffect(() => {
    // Reset sync status if user logs out
    if (status === "unauthenticated") {
      sessionStorage.removeItem("cartSynced");
      setHasSynced(false);
    }

    // Trigger sync only once when user authenticates for the first time in a session
    if (status === "authenticated" && !hasSynced) {
      syncGuestCart();
    }
  }, [status, hasSynced, syncGuestCart]);

  return null; // This component renders nothing
}
