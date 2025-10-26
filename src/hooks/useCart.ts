import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Design } from '@/generated/prisma'; // Use generated Prisma Design type

interface CartItem extends Design {
  quantity: number;
  selectedPackage?: string;
  selectedExtras?: any[];
}

export const useCart = () => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState(0);
  const [appliedDiscountId, setAppliedDiscountId] = useState<string | null>(null);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cart/items');
      if (response.ok) {
        const fullCart = await response.json();
        const frontendCartItems = fullCart.items.map((item: any) => ({
          ...item.design,
          quantity: item.quantity,
          selectedPackage: item.selectedPackage,
          selectedExtras: typeof item.selectedExtras === 'string' ? JSON.parse(item.selectedExtras) : item.selectedExtras,
        }));
        setCart(frontendCartItems);
        setAppliedDiscountAmount(fullCart.discountAmount || 0);
        setAppliedDiscountId(fullCart.discountId || null);
        setAppliedDiscountCode(fullCart.discountCode || null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch cart');
        setCart([]);
        setAppliedDiscountAmount(0);
        setAppliedDiscountId(null);
        setAppliedDiscountCode(null);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching cart.');
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCartFromStorage = useCallback(() => {
    setLoading(true);
    try {
      const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '[]');
      // Ensure cartFromStorage is an array
      if (Array.isArray(cartFromStorage)) {
        setCart(cartFromStorage);
      } else {
        console.error('Cart from local storage is not an array:', cartFromStorage);
        setCart([]); // Fallback to empty array
      }
    } catch (err) {
      console.error('Error parsing cart from local storage:', err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to load cart based on authentication status
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    } else if (status === 'unauthenticated') {
      loadCartFromStorage();
    }
    // While status is 'loading', do nothing.
  }, [status, fetchCart, loadCartFromStorage]);

  // Effect to listen for the sync event and force a reload
  useEffect(() => {
    const handleSync = () => {
      // After a sync, we are authenticated and must reload from the server.
      fetchCart();
    };
    window.addEventListener('cart-synced', handleSync);
    return () => {
      window.removeEventListener('cart-synced', handleSync);
    };
  }, [fetchCart]);

  const addToCart = async (design: Design, selectedPackage: string, selectedExtras: any[]) => {
    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ designId: design.id, selectedPackage, selectedExtras }),
        });
        if (response.ok) {
          const fullCart = await response.json();
          const frontendCartItems = fullCart.items.map((item: any) => ({
            ...item.design,
            quantity: item.quantity,
            selectedPackage: item.selectedPackage,
            selectedExtras: typeof item.selectedExtras === 'string' ? JSON.parse(item.selectedExtras) : item.selectedExtras,
          }));
          setCart(frontendCartItems);
          setAppliedDiscountAmount(fullCart.discountAmount || 0);
          setAppliedDiscountId(fullCart.discountId || null);
          setAppliedDiscountCode(fullCart.discountCode || null);
          toast.success('Added to cart!');
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || errorData.error || 'Failed to add to cart.');
        }
      } catch (err) {
        toast.error('An error occurred while adding to cart.');
      }
    } else {
      const existingItem = cart.find(item => item.id === design.id);
      if (existingItem) {
        toast.info('This design is already in your cart.');
      } else {
        const newCart = [...cart, { ...design, quantity: 1, selectedPackage, selectedExtras }];
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        toast.success('Added to cart!');
      }
    }
  };

  const removeItem = async (designId: string) => {
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
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to remove item from cart.');
            }
        } catch (err) {
            toast.error('An error occurred while removing from cart.');
        }
    } else {
        const newCart = cart.filter(item => item.id !== designId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        toast.success('Removed from cart.');
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      let itemTotal = item.basePrice * item.quantity;
      if (item.selectedExtras) {
        const extrasArray = Array.isArray(item.selectedExtras)
          ? item.selectedExtras
          : item.selectedExtras.selectedOptions;

        if (Array.isArray(extrasArray)) {
          extrasArray.forEach(extra => {
            if (extra && typeof extra.price === 'number') {
              itemTotal += extra.price;
            }
          });
        }
      }
      return total + itemTotal;
    }, 0);
  }, [cart]);

  const setAppliedDiscount = useCallback((amount: number, id: string | null, code: string | null) => {
    setAppliedDiscountAmount(amount);
    setAppliedDiscountId(id);
    setAppliedDiscountCode(code);
  }, []);

  return {
    cart,
    addToCart,
    removeItem,
    cartCount: cart.length,
    cartTotal,
    loading,
    error,
    fetchCart,
    appliedDiscountAmount,
    appliedDiscountId,
    appliedDiscountCode,
    setAppliedDiscount, // New function returned
  };
};
