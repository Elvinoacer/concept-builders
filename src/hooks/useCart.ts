import useCartStore from "@/lib/store/useCartStore";
import { useSession } from "next-auth/react";

export const useCart = () => {
  const {
    cart,
    loading,
    error,
    appliedDiscountAmount,
    appliedDiscountId,
    appliedDiscountCode,
    setAppliedDiscount,
    fetchCart,
    addToCart: addToCartStore,
    removeItem: removeItemFromStore,
    updateItem: updateItemInStore,
    clearCart: clearCartInStore,
    syncCart: syncCartInStore,
  } = useCartStore();

  const { data: session, status } = useSession();

  const addToCart = (design, selectedFileTypes, selectedExtras) => {
    return addToCartStore(design, selectedFileTypes, selectedExtras, status);
  };

  const removeItem = (cartItemId) => {
    return removeItemFromStore(cartItemId, status);
  };

  const updateItem = (cartItemId, updates) => {
    return updateItemInStore(cartItemId, updates, status);
  };

  const clearCart = () => {
    return clearCartInStore(status);
  };

  const syncCart = () => {
    return syncCartInStore();
  };

  return {
    cart,
    cartId: useCartStore.getState().cartId,
    loading,
    error,
    appliedDiscountAmount,
    appliedDiscountId,
    appliedDiscountCode,
    setAppliedDiscount,
    cartCount: cart.length,
    cartTotal: useCartStore.getState().cartTotal(),
    fetchCart,
    addToCart,
    removeItem,
    updateItem,
    clearCart,
    syncCart,
  };
};
