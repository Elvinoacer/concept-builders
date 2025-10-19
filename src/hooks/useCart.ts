import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Design } from '@/lib/dummydata';

interface CartItem extends Design {
  quantity: number;
}

export const useCart = () => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCartFromServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart/items');
      if (response.ok) {
        const dbCart: CartItem[] = await response.json();
        setCart(dbCart);
      } else {
        console.error('Failed to fetch DB cart:', await response.text());
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart from DB:', error);
      setCart([]);
    }
    setIsLoading(false);
  }, []);

  const loadCartFromStorage = useCallback(() => {
    setIsLoading(true);
    const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartFromStorage);
    setIsLoading(false);
  }, []);

  // Effect to load cart based on authentication status
  useEffect(() => {
    if (status === 'authenticated') {
      loadCartFromServer();
    } else if (status === 'unauthenticated') {
      loadCartFromStorage();
    }
    // While status is 'loading', do nothing.
  }, [status, loadCartFromServer, loadCartFromStorage]);

  // Effect to listen for the sync event and force a reload
  useEffect(() => {
    const handleSync = () => {
      // After a sync, we are authenticated and must reload from the server.
      loadCartFromServer();
    };
    window.addEventListener('cart-synced', handleSync);
    return () => {
      window.removeEventListener('cart-synced', handleSync);
    };
  }, [loadCartFromServer]); // Depend on the memoized function

  const addToCart = async (design: Design) => {
    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ designId: design.id }),
        });
        if (response.ok) {
          const newCart: CartItem[] = await response.json();
          setCart(newCart);
          toast.success('Added to cart!');
        } else {
          toast.error('This item is already in your cart.');
        }
      } catch (error) {
        toast.error('An error occurred while adding to cart.');
      }
    } else {
      const existingItem = cart.find(item => item.id === design.id);
      if (existingItem) {
        toast.info('This design is already in your cart.');
      } else {
        const newCart = [...cart, { ...design, quantity: 1 }];
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        toast.success('Added to cart!');
      }
    }
  };

  const removeFromCart = async (designId: string) => {
    if (status === 'authenticated') {
        try {
            const response = await fetch(`/api/cart/items/${designId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const newCart: CartItem[] = await response.json();
                setCart(newCart);
                toast.success('Removed from cart.');
            } else {
                toast.error('Failed to remove item from cart.');
            }
        } catch (error) {
            toast.error('An error occurred while removing from cart.');
        }
    } else {
        const newCart = cart.filter(item => item.id !== designId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        toast.success('Removed from cart.');
    }
  };

  return { cart, addToCart, removeFromCart, cartCount: cart.length, isLoading };
};
