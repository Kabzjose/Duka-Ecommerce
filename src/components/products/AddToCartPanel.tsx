'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/lib/types';
import { ShoppingBag, Zap, Heart, Minus, Plus, Check } from 'lucide-react';

export function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { isWishlisted, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stockQuantity === 0;

  async function handleAdd(buyNow: boolean) {
    if (!user) return router.push('/login');
    setError(null);
    setIsAdding(true);
    try {
      await addItem(product.id, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      if (buyNow) router.push('/cart');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add to cart');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col gap-6">
      {/* Quantity Stepper & Wishlist */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
            Quantity
          </label>
          <div className="flex items-center border border-border rounded-lg bg-bg overflow-hidden shadow-subtle">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={outOfStock || quantity <= 1}
              className="p-2.5 hover:bg-surface text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 text-sm font-bold font-mono text-ink min-w-[2.5rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
              disabled={outOfStock || quantity >= product.stockQuantity}
              className="p-2.5 hover:bg-surface text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
            Wishlist
          </label>
          <button
            onClick={() => toggle(product.id)}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              wishlisted
                ? 'bg-danger/10 border-danger text-danger'
                : 'border-border bg-bg text-ink hover:border-ink/40'
            }`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`h-5 w-5 ${wishlisted ? 'fill-danger text-danger' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-danger bg-danger-light p-3 rounded-lg border border-danger/20">
          {error}
        </p>
      )}

      {/* Main Action CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="w-full py-4 text-sm font-bold gap-2"
          onClick={() => handleAdd(false)}
          isLoading={isAdding}
          disabled={outOfStock}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4 text-brand" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </>
          )}
        </Button>

        <Button
          variant="primary"
          size="lg"
          className="w-full py-4 text-sm font-bold gap-2 bg-brand hover:bg-brand-dark"
          onClick={() => handleAdd(true)}
          isLoading={isAdding}
          disabled={outOfStock}
        >
          <Zap className="h-4 w-4 text-accent-light" /> Buy Now
        </Button>
      </div>
    </div>
  );
}
