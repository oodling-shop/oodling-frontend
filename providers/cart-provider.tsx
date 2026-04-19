'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/lib/shopify/cart';
import type { ShopifyCart, ShopifyCartLine } from '@/lib/shopify/types';

interface CartContextValue {
  cart: ShopifyCart | null;
  cartId: string | null;
  lines: ShopifyCartLine[];
  checkoutUrl: string | null;
  isLoading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoading = isPending || isFetching;

  const cartId = cart?.id ?? null;
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const checkoutUrl = cart?.checkoutUrl ?? null;

  const clearError = () => setError(null);

  const refreshCart = async () => {
    try {
      const updated = await getCart();
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    }
  };

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load cart'))
      .finally(() => setIsFetching(false));
  }, []);

  const addItem = async (variantId: string, quantity = 1) => {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await addToCart(variantId, quantity);
        setCart(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      }
    });
  };

  const updateItem = async (lineId: string, quantity: number) => {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await updateCartItem(lineId, quantity);
        setCart(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update cart item');
      }
    });
  };

  const removeItem = async (lineId: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await removeCartItem(lineId);
        setCart(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        lines,
        checkoutUrl,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
