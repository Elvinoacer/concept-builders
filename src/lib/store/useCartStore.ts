import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { calculateItemTotal } from "@/lib/calculate-total";
import { toast } from "sonner";
import { Design, PackageOption } from "@/generated/prisma/browser";

type FetchCartOptions = {
  silent?: boolean;
  force?: boolean;
};

let fetchCartInFlight: Promise<void> | null = null;

interface CartItem {
  cartItemId: string;
  quantity: number;
  selectedFileTypes: string[];
  selectedExtras?: any[];
  design: Design & { packageOptions: PackageOption[] };
}

interface CartStore {
  cart: CartItem[];
  cartId: string | null;
  loading: boolean;
  error: string | null;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;

  // Actions
  setCart: (cart: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAppliedDiscount: (
    amount: number,
    id: string | null,
    code: string | null,
  ) => void;

  // Computed values
  cartCount: () => number;
  cartTotal: () => number;

  // Cart operations
  fetchCart: (status: string, options?: FetchCartOptions) => Promise<void>;
  addToCart: (
    design: Design,
    selectedFileTypes: string[],
    selectedExtras: any[],
    status: string,
  ) => Promise<boolean>;
  removeItem: (cartItemId: string, status: string) => Promise<void>;
  updateItem: (
    cartItemId: string,
    updates: Partial<CartItem>,
    status: string,
  ) => Promise<void>;
  clearCart: (status: string) => Promise<void>;
  syncCart: () => Promise<void>;
}

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        cartId: null,
        loading: false,
        error: null,
        appliedDiscountAmount: 0,
        appliedDiscountId: null,
        appliedDiscountCode: null,

        setCart: (cart) => {
          if (cart && cart.items) {
            const newCartItems = cart.items.map((item) => {
              if (item.id && !item.cartItemId) {
                // Item from DB, map id to cartItemId
                return { ...item, cartItemId: item.id };
              }
              return item; // Item already has cartItemId (from local state)
            });
            set({ cart: newCartItems, cartId: cart.id });
          } else {
            // Handle cases where cart is cleared or local storage is empty
            set({
              cart: cart ? cart.items : [],
              cartId: cart ? cart.id : null,
            });
          }
        },
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
          get().cart.reduce(
            (total, item) => total + calculateItemTotal(item),
            0,
          ),

        fetchCart: async (status, options = {}) => {
          const { silent = false, force = false } = options;

          if (fetchCartInFlight && !force) {
            return fetchCartInFlight;
          }

          const runner = async () => {
            if (!silent) {
              set({ loading: true, error: null });
            }

            if (status === "authenticated") {
              try {
                const response = await fetch("/api/cart/items", {
                  cache: "no-store",
                });

                if (response.ok) {
                  const fullCart = await response.json();
                  get().setCart(fullCart);
                  set({ error: null });
                } else {
                  const errorData = await response.json();
                  set({
                    error: errorData.error || "Failed to fetch cart",
                    cart: [],
                  });
                }
              } catch (err: any) {
                set({
                  error:
                    err.message ||
                    "An unexpected error occurred while fetching cart.",
                  cart: [],
                });
              } finally {
                if (!silent) {
                  set({ loading: false });
                }
              }
            } else {
              try {
                const cartFromStorage = JSON.parse(
                  localStorage.getItem("cart") || "[]",
                );
                if (Array.isArray(cartFromStorage)) {
                  set({ cart: cartFromStorage, error: null });
                } else {
                  set({ cart: [], error: null });
                }
              } catch {
                set({ cart: [], error: null });
              } finally {
                if (!silent) {
                  set({ loading: false });
                }
              }
            }
          };

          fetchCartInFlight = runner().finally(() => {
            fetchCartInFlight = null;
          });

          return fetchCartInFlight;
        },

        addToCart: async (
          design,
          selectedFileTypes,
          selectedExtras,
          status,
        ) => {
          const { cart, setCart } = get();

          const normalizedSelectedFileTypes = [...selectedFileTypes].sort();
          const normalizedSelectedExtras = [...selectedExtras].sort((a, b) =>
            String(a?.id || "").localeCompare(String(b?.id || "")),
          );

          const newItem: CartItem = {
            cartItemId:
              status === "authenticated"
                ? `temp-${Date.now()}`
                : `local-${Date.now()}`,
            design: design as any,
            quantity: 1,
            selectedFileTypes: normalizedSelectedFileTypes,
            selectedExtras: normalizedSelectedExtras,
          };

          const existingItemIndex = cart.findIndex(
            (item) =>
              item.design.id === design.id &&
              JSON.stringify([...(item.selectedFileTypes || [])].sort()) ===
                JSON.stringify(normalizedSelectedFileTypes) &&
              JSON.stringify(
                item.selectedExtras?.map((e) => e.id).sort() || [],
              ) ===
                JSON.stringify(
                  normalizedSelectedExtras.map((e) => e.id).sort(),
                ),
          );

          if (existingItemIndex > -1) {
            toast.info("This item is already in your cart.");
            return false;
          }

          if (status === "authenticated") {
            const optimisticCart = [...cart, newItem];
            setCart({ items: optimisticCart, id: get().cartId });

            try {
              const response = await fetch("/api/cart/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  designId: design.id,
                  selectedFileTypes: normalizedSelectedFileTypes,
                  selectedExtras: normalizedSelectedExtras,
                }),
              });

              if (response.ok) {
                const updatedCart = await response.json();
                if (updatedCart?.items) {
                  setCart(updatedCart);
                } else {
                  await get().fetchCart("authenticated", { silent: true });
                }
                toast.success("Added to cart!");
                return true;
              }

              const errorData = await response.json();
              setCart({ items: cart, id: get().cartId });
              toast.error(errorData.error || "Failed to add to cart.");
              return false;
            } catch (err) {
              setCart({ items: cart, id: get().cartId });
              toast.error("An error occurred while adding to cart.");
              return false;
            }
          } else {
            const newCart = [...cart, newItem];
            setCart({ items: newCart, id: null });
            localStorage.setItem("cart", JSON.stringify(newCart));
            toast.success("Added to cart!");
            return true;
          }
        },

        removeItem: async (cartItemId, status) => {
          const { cart, setCart } = get();

          if (status === "authenticated") {
            const previousCart = [...cart];
            const optimisticCart = cart.filter(
              (item) => item.cartItemId !== cartItemId,
            );
            setCart({ items: optimisticCart, id: get().cartId });

            try {
              const response = await fetch(`/api/cart/items/${cartItemId}`, {
                method: "DELETE",
              });

              if (response.ok) {
                const updatedCart = await response.json();
                if (updatedCart?.items) {
                  setCart(updatedCart);
                }
                toast.success("Removed from cart.");
              } else {
                const errorData = await response.json();
                setCart({ items: previousCart, id: get().cartId });
                toast.error(
                  errorData.error || "Failed to remove item from cart.",
                );
              }
            } catch (err) {
              setCart({ items: previousCart, id: get().cartId });
              toast.error("An error occurred while removing item from cart.");
            }
          } else {
            const newCart = cart.filter(
              (item) => item.cartItemId !== cartItemId,
            );
            setCart({ items: newCart, id: null });
            localStorage.setItem("cart", JSON.stringify(newCart));
            toast.success("Removed from cart.");
          }
        },

        updateItem: async (cartItemId, updates, status) => {
          const { cart, setCart } = get();

          if (status === "authenticated") {
            const previousCart = [...cart];
            const optimisticCart = cart.map((item) =>
              item.cartItemId === cartItemId ? { ...item, ...updates } : item,
            );
            setCart({ items: optimisticCart, id: get().cartId });

            try {
              const response = await fetch(`/api/cart/items/${cartItemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
              });

              if (response.ok) {
                const updatedCart = await response.json();
                if (updatedCart?.items) {
                  setCart(updatedCart);
                }
                toast.success("Cart updated.");
              } else {
                const errorData = await response.json();
                setCart({ items: previousCart, id: get().cartId });
                toast.error(errorData.error || "Failed to update cart.");
              }
            } catch (err) {
              setCart({ items: previousCart, id: get().cartId });
              toast.error("An error occurred while updating cart.");
            }
          } else {
            const newCart = cart.map((item) =>
              item.cartItemId === cartItemId ? { ...item, ...updates } : item,
            );
            setCart({ items: newCart, id: null });
            localStorage.setItem("cart", JSON.stringify(newCart));
            toast.success("Cart updated.");
          }
        },

        clearCart: async (status) => {
          set({ cart: [] });
          if (status === "unauthenticated") {
            localStorage.removeItem("cart");
          }
          toast.success("Cart cleared.");
        },

        syncCart: async () => {
          const { cart, setCart } = get();
          if (cart.length > 0) {
            try {
              const response = await fetch("/api/cart/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cart),
              });

              if (response.ok) {
                const serverCart = await response.json();
                setCart(serverCart);
                localStorage.removeItem("cart");
                window.dispatchEvent(new CustomEvent("cart-synced"));
              } else {
                console.error(
                  "Failed to sync guest cart:",
                  await response.text(),
                );
              }
            } catch (error) {
              console.error("Error syncing guest cart:", error);
            }
          }
        },
      }),
      {
        name: "cart-storage", // name of the item in the storage (must be unique)
        partialize: (state) => ({
          cart: state.cart,
          cartId: state.cartId,
          appliedDiscountAmount: state.appliedDiscountAmount,
          appliedDiscountId: state.appliedDiscountId,
          appliedDiscountCode: state.appliedDiscountCode,
        }),
      },
    ),
  ),
);

export default useCartStore;
