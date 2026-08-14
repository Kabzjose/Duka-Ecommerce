'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/lib/types';

export function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(buyNow: boolean) {
    if (!user) return router.push('/login');
    setError(null);
    setIsAdding(true);
    try {
      await addItem(product.id, quantity);
      if (buyNow) router.push('/cart');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add to cart');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-muted">Qty</label>
        <div className="flex items-center border border-border rounded">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1.5" aria-label="Decrease quantity">−</button>
          <span className="px-3 text-sm font-mono">{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))} className="px-3 py-1.5" aria-label="Increase quantity">+</button>
        </div>
      </div>
      {error && <p className="text-sm text-danger mb-3">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => handleAdd(false)} isLoading={isAdding} disabled={product.stockQuantity === 0}>
          Add to Cart
        </Button>
        <Button onClick={() => handleAdd(true)} isLoading={isAdding} disabled={product.stockQuantity === 0}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}
