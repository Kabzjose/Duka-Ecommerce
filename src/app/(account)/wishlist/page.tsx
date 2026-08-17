'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/lib/types';
import { Heart, ArrowRight } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    Promise.all(
      ids.map((id) =>
        fetch(`${API_BASE_URL}/products/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    )
      .then((results) => setProducts(results.map((r) => r?.product).filter(Boolean)))
      .finally(() => setIsLoading(false));
  }, [ids]);

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted font-mono text-sm">Loading saved wishlist...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-danger-light text-danger w-fit mx-auto mb-4">
          <Heart className="h-10 w-10" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-ink mb-2">Your Wishlist is Empty</h2>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          Save your favorite products while browsing so you can easily return and purchase them later.
        </p>
        <Link href="/shop">
          <Button size="lg" className="w-full gap-2">
            Explore Products <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Saved Items</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink mt-1">
          Your Saved Wishlist ({products.length})
        </h1>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
