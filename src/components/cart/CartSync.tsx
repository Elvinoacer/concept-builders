'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// This component is a singleton that handles the one-time sync of a guest cart to the DB upon login.
export function CartSync() {
  const { status } = useSession();
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    // Reset sync status if user logs out
    if (status === 'unauthenticated') {
      setHasSynced(false);
    }

    // Trigger sync only once when user authenticates for the first time in a session
    if (status === 'authenticated' && !hasSynced) {
      const syncGuestCart = async () => {
        const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '[]');

        if (cartFromStorage.length > 0) {
          try {
            const response = await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cartFromStorage),
            });

            if (response.ok) {
              // Sync successful, clear local storage cart
              localStorage.setItem('cart', '[]');
            } else {
              console.error('Failed to sync guest cart:', await response.text());
            }
          } catch (error) {
            console.error('Error syncing guest cart:', error);
          }
        }
        
        // Mark as synced for this session to prevent re-syncing
        setHasSynced(true);
        // Broadcast an event to tell other components (like useCart) to reload their data
        window.dispatchEvent(new CustomEvent('cart-synced'));
      };

      syncGuestCart();
    }
  }, [status, hasSynced]);

  return null; // This component renders nothing
}