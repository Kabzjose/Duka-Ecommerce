'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import type { Cart } from '@/lib/types';

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: Cart = { cartId: '', items: [], total: 0 };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!accessToken) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.get<Cart>('/cart', accessToken);
      setCart(res);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Reload the cart whenever login state changes — e.g. right after login, or on logout it clears
  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      await Promise.resolve();

      if (cancelled) return;
      await refreshCart();
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [refreshCart]);

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      if (!accessToken) throw new Error('Must be logged in to add to cart');
      const res = await api.post<Cart>('/cart/items', { productId, quantity }, accessToken);
      setCart(res);
    },
    [accessToken]
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      if (!accessToken) return;
      const res = await api.patch<Cart>(`/cart/items/${productId}`, { quantity }, accessToken);
      setCart(res);
    },
    [accessToken]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!accessToken) return;
      const res = await api.delete<Cart>(`/cart/items/${productId}`, accessToken);
      setCart(res);
    },
    [accessToken]
  );

  const clearCart = useCallback(async () => {
    if (!accessToken) return;
    await api.delete('/cart', accessToken);
    setCart(EMPTY_CART);
  }, [accessToken]);

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, itemCount, isLoading, addItem, updateItem, removeItem, clearCart, refreshCart }}
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
