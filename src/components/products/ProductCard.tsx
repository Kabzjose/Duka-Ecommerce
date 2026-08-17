'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { Price } from '@/components/ui/Price';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { isWishlisted, toggle } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    setIsAdding(true);
    try {
      await addItem(product.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="group relative flex flex-col rounded-xl bg-surface border border-border overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-ink/20">
      {/* Product Image Container */}
      <Link href={`/product/${product.id}`} className="relative aspect-square bg-bg overflow-hidden block">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted/60 text-xs font-mono">
            No image available
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {outOfStock ? (
            <span className="rounded bg-ink/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-subtle">
              Only {product.stockQuantity} left
            </span>
          ) : null}
        </div>

        {/* Wishlist Button Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-all duration-200 shadow-subtle ${
            wishlisted
              ? 'bg-white text-danger'
              : 'bg-white/80 text-ink hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-danger text-danger' : ''}`} />
        </button>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted mb-1 font-mono">
            {product.category}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-ink line-clamp-2 hover:text-brand transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-border-subtle flex flex-col gap-3">
          <Price amount={product.price} size="sm" />

          <button
            onClick={handleAddToCart}
            disabled={outOfStock || isAdding}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              justAdded
                ? 'bg-brand text-white'
                : 'bg-bg hover:bg-brand hover:text-white border border-border hover:border-brand text-ink'
            }`}
          >
            {isAdding ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" /> {outOfStock ? 'Unavailable' : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
