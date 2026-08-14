
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Price } from '@/components/ui/Price';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const outOfStock = product.stockQuantity === 0;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setIsAdding(true);
    try {
      await addItem(product.id, 1);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block border border-border rounded bg-white/40 overflow-hidden hover:border-ink/30 transition-colors"
    >
      <div className="relative aspect-square bg-brand-light overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted text-sm">No image</div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted((w) => !w);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-brand text-brand' : 'text-ink'}`} />
        </button>

        {outOfStock && (
          <span className="absolute bottom-2 left-2 rounded bg-ink/90 px-2 py-0.5 text-[11px] font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-[11px] uppercase tracking-wide text-muted mb-1">{product.category}</p>
        <h3 className="text-sm font-medium line-clamp-1 mb-1.5">{product.name}</h3>
        <Price amount={product.price} size="sm" />
        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-3"
          onClick={handleAddToCart}
          isLoading={isAdding}
          disabled={outOfStock}
        >
          {outOfStock ? 'Unavailable' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  );
}