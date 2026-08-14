import Link from 'next/link';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const CATEGORY_IMAGE_QUERIES: Record<string, string> = {
  Electronics: 'electronics gadgets flatlay',
  Accessories: 'phone accessories flatlay',
  Stationery: 'notebook stationery desk',
  Fashion: 'clothing rack fashion',
  'Home & Living': 'home decor items',
  Beauty: 'skincare beauty products',
  Sports: 'sports equipment gear',
};

async function FeaturedProducts() {
  const { items } = await getProducts({ limit: 8 });
  return <ProductGrid products={items} />;
}

async function CategoryStrip() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {categories.map((c) => (
        <Link
          key={c.category}
          href={`/categories/${encodeURIComponent(c.category)}`}
          className="group border border-border rounded p-4 text-center hover:border-brand transition-colors bg-white/40"
        >
          <p className="text-sm font-medium group-hover:text-brand transition-colors">{c.category}</p>
          <p className="text-xs text-muted mt-1">{c.count} items</p>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Compact hero — useful, not decorative */}
      <section className="py-10 md:py-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
            Shop smarter.
          </h1>
          <p className="mt-2 text-muted max-w-md">
            Quality products, fair prices, delivered to your door.
          </p>
        </div>
        <Link href="/shop">
          <Button size="lg" className="gap-2">
            Shop Now <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Categories */}
      <section className="py-10">
        <h2 className="text-lg font-medium mb-4">Shop by Category</h2>
        <Suspense fallback={<div className="h-24 bg-border/30 rounded animate-pulse" />}>
          <CategoryStrip />
        </Suspense>
      </section>

      {/* Featured products */}
      <section className="py-10 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Featured Products</h2>
          <Link href="/shop" className="text-sm text-brand font-medium hover:underline">
            View all
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* Newsletter */}
      <section className="py-10 border-t border-border">
        <div className="max-w-md">
          <h2 className="text-lg font-medium mb-1">Stay updated</h2>
          <p className="text-sm text-muted mb-4">Get notified about new arrivals and deals.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="flex-1 rounded border border-border bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}