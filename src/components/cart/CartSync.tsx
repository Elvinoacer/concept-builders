"use client";

import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

// This component is a singleton that handles the one-time sync of a guest cart to the DB upon login.
export function CartSync() {
  const { status } = useSession();
  const [hasSynced, setHasSynced] = useState(false);
  const { syncCart } = useCart();

  const syncGuestCart = useCallback(async () => {
    await syncCart();
    // Mark as synced for this session to prevent re-syncing
    setHasSynced(true);
  }, [syncCart]);

  useEffect(() => {
    // Reset sync status if user logs out
    if (status === "unauthenticated") {
      setHasSynced(false);
    }

    // Trigger sync only once when user authenticates for the first time in a session
    if (status === "authenticated" && !hasSynced) {
      syncGuestCart();
    }
  }, [status, hasSynced, syncGuestCart]);

  return null; // This component renders nothing
}
