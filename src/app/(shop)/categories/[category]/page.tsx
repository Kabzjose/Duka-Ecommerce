import { Suspense } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';
import { ChevronRight } from 'lucide-react';

async function CategoryResults({ category }: { category: string }) {
  const result = await getProducts({ category, limit: 24 });
  return <ProductGrid products={result.items} />;
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted mb-4">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/categories" className="hover:text-ink">Categories</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink font-bold">{decoded}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
          {decoded}
        </h1>
        <p className="text-sm text-muted mt-1">Browse all available items in the {decoded} category.</p>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <CategoryResults category={decoded} />
      </Suspense>
    </div>
  );
}
