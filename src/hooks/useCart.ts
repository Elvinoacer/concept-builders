import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Design } from '@/generated/prisma'; // Use generated Prisma Design type

interface SelectedDocuments {
  architecturalPdf: boolean;
  architecturalCad: boolean;
  structuralPdf: boolean;
  structuralCad: boolean;
  billOfQuantities: boolean;
}

interface CartItem extends Design {
  cartItemId: string;
  quantity: number;
  selectedDocuments: SelectedDocuments;
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
          cartItemId: item.id, // Add this line
          quantity: item.quantity,
          selectedDocuments: item.selectedDocuments,
          selectedPackage: item.selectedPackage,
          selectedExtras: typeof item.selectedExtras === 'string' ? JSON.parse(item.selectedExtras) : item.selectedExtras,
        }));
        setCart(frontendCartItems);
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

  useEffect(() => {
    if (status === 'authenticated') {
      syncCart().then(() => fetchCart());
    } else if (status === 'unauthenticated') {
      loadCartFromStorage();
    }
    // While status is 'loading', do nothing.
  }, [status, fetchCart, loadCartFromStorage]);

  const addToCart = async (design: Design, selectedDocuments: SelectedDocuments, selectedPackage: string, selectedExtras: any[]) => {
    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ designId: design.id, selectedDocuments, selectedPackage, selectedExtras }),
        });
        if (response.ok) {
          const fullCart = await response.json();
          const frontendCartItems = fullCart.items.map((item: any) => ({
            ...item.design,
            cartItemId: item.id, // Add this line
            quantity: item.quantity,
            selectedFileType: item.selectedFileType,
            selectedPackage: item.selectedPackage,
            selectedExtras: typeof item.selectedExtras === 'string' ? JSON.parse(item.selectedExtras) : item.selectedExtras,
          }));
          setCart(frontendCartItems);
          toast.success('Added to cart!');
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || errorData.error || 'Failed to add to cart.');
        }
      } catch (err) {
        toast.error('An error occurred while adding to cart.');
      }
    } else {
      const existingItem = cart.find(item => item.id === design.id && JSON.stringify(item.selectedDocuments) === JSON.stringify(selectedDocuments) && item.selectedPackage === selectedPackage && JSON.stringify(item.selectedExtras) === JSON.stringify(selectedExtras));
      if (existingItem) {
        toast.info('This design is already in your cart.');
      } else {
        const newCart = [...cart, { ...design, quantity: 1, selectedDocuments, selectedPackage, selectedExtras }];
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        toast.success('Added to cart!');
      }
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (status === 'authenticated') {
        try {
            const response = await fetch(`/api/cart/items/${cartItemId}`, {
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

  const updateItem = useCallback(async (itemId: string, updates: { quantity?: number; selectedDocuments?: SelectedDocuments; selectedPackage?: string; selectedExtras?: any[] }) => {
    if (status === 'authenticated') {
      try {
        const response = await fetch(`/api/cart/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (response.ok) {
          const newCart: CartItem[] = await response.json();
          setCart(newCart);
          toast.success('Cart item updated.');
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to update item in cart.');
        }
      } catch (err) {
        toast.error('An error occurred while updating the cart.');
      }
    } else {
      const newCart = cart.map(item => {
        if (item.id === itemId) {
          return { ...item, ...updates };
        }
        return item;
      });
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      toast.success('Cart item updated.');
    }
  }, [status, cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      let itemTotal = item.basePrice * item.quantity;

      if (item.selectedDocuments) {
        if (item.selectedDocuments.architecturalPdf) {
          itemTotal += item.architecturalPdfPrice || 0;
        }
        if (item.selectedDocuments.architecturalCad) {
          itemTotal += item.architecturalCadPrice || 0;
        }
        if (item.selectedDocuments.structuralPdf) {
          itemTotal += item.structuralPdfPrice || 0;
        }
        if (item.selectedDocuments.structuralCad) {
          itemTotal += item.structuralCadPrice || 0;
        }
        if (item.selectedDocuments.billOfQuantities) {
          itemTotal += item.billOfQuantitiesPrice || 0;
        }
      }

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

  const syncCart = async () => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (localCart.length > 0) {
      try {
        const response = await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localCart),
        });
        if (response.ok) {
          const updatedCart = await response.json();
          setCart(updatedCart.items.map((item: any) => ({
            ...item.design,
            cartItemId: item.id, // Add this line
            quantity: item.quantity,
            selectedDocuments: item.selectedDocuments,
            selectedPackage: item.selectedPackage,
            selectedExtras: typeof item.selectedExtras === 'string' ? JSON.parse(item.selectedExtras) : item.selectedExtras,
          })));
          localStorage.removeItem('cart');
          toast.success('Cart synced successfully!');
        } else {
          toast.error('Failed to sync cart.');
        }
      } catch (error) {
        toast.error('An error occurred while syncing cart.');
      }
    }
  };

  

  return {
    cart,
    addToCart,
    removeItem,
    updateItem, // Add this line
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
