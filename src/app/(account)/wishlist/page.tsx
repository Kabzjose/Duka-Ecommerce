'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/lib/types';

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

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Loading...</div>;

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-medium mb-2">Your wishlist is empty</p>
        <p className="text-sm text-muted mb-6">Save products you love for later.</p>
        <Link href="/shop"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Wishlist</h1>
      <ProductGrid products={products} />
    </div>
  );
}
