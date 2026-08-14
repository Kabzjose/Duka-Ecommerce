'use client';

import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'duka_wishlist';

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setIds(JSON.parse(stored));
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (productId: string) => {
      persist(ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId]);
    },
    [ids, persist]
  );

  const isWishlisted = useCallback((productId: string) => ids.includes(productId), [ids]);

  return { ids, toggle, isWishlisted };
}
