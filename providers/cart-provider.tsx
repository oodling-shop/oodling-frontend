'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/lib/shopify/cart';
import type { ShopifyCart } from '@/lib/shopify/types';

interface CartContextValue {
  cart: ShopifyCart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(true);

  const isLoading = isPending || isFetching;

  const refreshCart = async () => {
    const updated = await getCart();
    setCart(updated);
  };

  useEffect(() => {
    getCart()
      .then(setCart)
      .finally(() => setIsFetching(false));
  }, []);

  const addItem = async (variantId: string, quantity = 1) => {
    startTransition(async () => {
      const updated = await addToCart(variantId, quantity);
      setCart(updated);
    });
  };

  const updateItem = async (lineId: string, quantity: number) => {
    startTransition(async () => {
      const updated = await updateCartItem(lineId, quantity);
      setCart(updated);
    });
  };

  const removeItem = async (lineId: string) => {
    startTransition(async () => {
      const updated = await removeCartItem(lineId);
      setCart(updated);
    });
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
