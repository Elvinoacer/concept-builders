import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { calculateItemTotal } from "@/lib/calculate-total";
import { toast } from "sonner";
import { Design, PackageOption } from "@/generated/prisma";

interface CartItem {
  cartItemId: string;
  quantity: number;
  selectedFileTypes: string[];
  selectedExtras?: any[];
  design: Design & { packageOptions: PackageOption[] };
}

interface CartStore {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;

  // Actions
  setCart: (cart: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAppliedDiscount: (
    amount: number,
    id: string | null,
    code: string | null
  ) => void;

  // Computed values
  cartCount: () => number;
  cartTotal: () => number;

  // Cart operations
  fetchCart: (status: string) => Promise<void>;
  addToCart: (
    design: Design,
    selectedFileTypes: string[],
    selectedPackage: string[],
    selectedExtras: any[],
    status: string
  ) => boolean;
  removeItem: (cartItemId: string, status: string) => void;
  updateItem: (
    cartItemId: string,
    updates: Partial<CartItem>,
    status: string
  ) => void;
  clearCart: (status: string) => void;
  syncCart: () => Promise<void>;
}

const useCartStore = create<CartStore>()(
  devtools((set, get) => ({
    cart: [],
    loading: true,
    error: null,
    appliedDiscountAmount: 0,
    appliedDiscountId: null,
    appliedDiscountCode: null,

    setCart: (cart) => set({ cart }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setAppliedDiscount: (amount, id, code) =>
      set({
        appliedDiscountAmount: amount,
        appliedDiscountId: id,
        appliedDiscountCode: code,
      }),

    cartCount: () => get().cart.length,
    cartTotal: () =>
      get().cart.reduce((total, item) => total + calculateItemTotal(item), 0),

    fetchCart: async (status) => {
      set({ loading: true, error: null });
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/cart/items");
          if (response.ok) {
            const fullCart = await response.json();
            const frontendCartItems = fullCart.items.map((item: any) => ({
              cartItemId: item.id,
              quantity: item.quantity,
              selectedFileTypes: item.selectedFileTypes || [],
              selectedExtras: item.selectedExtras || [],
              design: item.design,
            }));
            set({ cart: frontendCartItems });
          } else {
            const errorData = await response.json();
            set({ error: errorData.error || "Failed to fetch cart", cart: [] });
          }
        } catch (err: any) {
          set({
            error:
              err.message ||
              "An unexpected error occurred while fetching cart.",
            cart: [],
          });
        } finally {
          set({ loading: false });
        }
      } else {
        try {
          const cartFromStorage = JSON.parse(
            localStorage.getItem("cart") || "[]"
          );
          if (Array.isArray(cartFromStorage)) {
            set({ cart: cartFromStorage });
          } else {
            set({ cart: [] });
          }
        } catch (err) {
          set({ cart: [] });
        } finally {
          set({ loading: false });
        }
      }
    },

    addToCart: (
      design,
      selectedFileTypes,
      selectedPackage,
      selectedExtras,
      status
    ) => {
      const { cart, setCart } = get();

      const newItem: CartItem = {
        cartItemId:
          status === "authenticated"
            ? `temp-${Date.now()}`
            : `local-${Date.now()}`,
        design: design as any,
        quantity: 1,
        selectedFileTypes,
        selectedExtras,
      };

      const existingItemIndex = cart.findIndex(
        (item) =>
          item.design.id === design.id &&
          JSON.stringify(item.selectedFileTypes.sort()) ===
            JSON.stringify(selectedFileTypes.sort()) &&
          JSON.stringify(item.selectedExtras?.map((e) => e.id).sort() || []) ===
            JSON.stringify(selectedExtras.map((e) => e.id).sort())
      );

      if (existingItemIndex > -1) {
        toast.info("This item is already in your cart.");
        return false;
      }

      if (status === "authenticated") {
        // API call to add to cart
        (async () => {
          try {
            const response = await fetch("/api/cart/items", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                designId: design.id,
                selectedFileTypes,
                selectedPackage,
                selectedExtras,
              }),
            });

            if (response.ok) {
              const updatedCart = await response.json();
              const frontendCartItems = updatedCart.items.map((item: any) => ({
                cartItemId: item.id,
                quantity: item.quantity,
                selectedFileTypes: item.selectedFileTypes || [],
                selectedExtras: item.selectedExtras || [],
                design: item.design,
              }));
              setCart(frontendCartItems);
              toast.success("Added to cart!");
            } else {
              const errorData = await response.json();
              toast.error(errorData.error || "Failed to add to cart.");
            }
          } catch (err) {
            toast.error("An error occurred while adding to cart.");
          }
        })();
      } else {
        const newCart = [...cart, newItem];
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        toast.success("Added to cart!");
      }

      return true;
    },

    removeItem: async (cartItemId, status) => {
      const { cart, setCart, fetchCart } = get();

      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/cart/items/${cartItemId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            const updatedCart = await response.json();
            const frontendCartItems = updatedCart.items.map((item: any) => ({
              cartItemId: item.id,
              quantity: item.quantity,
              selectedFileTypes: item.selectedFileTypes || [],
              selectedExtras: item.selectedExtras || [],
              design: item.design,
            }));
            setCart(frontendCartItems);
            toast.success("Removed from cart.");
          } else {
            const errorData = await response.json();
            toast.error(errorData.error || "Failed to remove item from cart.");
          }
        } catch (err) {
          toast.error("An error occurred while removing item from cart.");
        }
      } else {
        // For unauthenticated users, remove from local storage
        const newCart = cart.filter((item) => item.cartItemId !== cartItemId);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        toast.success("Removed from cart.");
      }
    },

    updateItem: (cartItemId, updates, status) => {
      const { cart, setCart } = get();
      const newCart = cart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, ...updates } : item
      );
      setCart(newCart);
      if (status === "unauthenticated") {
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
      toast.success("Cart updated.");
    },

    clearCart: (status) => {
      set({ cart: [] });
      if (status === "unauthenticated") {
        localStorage.removeItem("cart");
      }
      toast.success("Cart cleared.");
    },

    syncCart: async () => {
      const { cart } = get();
      if (cart.length > 0) {
        try {
          const response = await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cart),
          });

          if (response.ok) {
            localStorage.removeItem("cart");
            window.dispatchEvent(new CustomEvent("cart-synced"));
          } else {
            console.error("Failed to sync guest cart:", await response.text());
          }
        } catch (error) {
          console.error("Error syncing guest cart:", error);
        }
      }
    },
  }))
);

export default useCartStore;
