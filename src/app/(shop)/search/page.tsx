import { Suspense } from 'react';
import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';

async function SearchResults({ q }: { q: string }) {
  const result = await getProducts({ search: q, limit: 20 });
  if (result.items.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <p className="font-medium mb-2">No products matched &quot;{q}&quot;</p>
        <p className="text-sm text-muted">Try checking your spelling, using fewer words, or browsing a category.</p>
      </div>
    );
  }
  return (
    <>
      <p className="text-sm text-muted mb-4">{result.total} result{result.total !== 1 ? 's' : ''} for &quot;{q}&quot;</p>
      <ProductGrid products={result.items} />
    </>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Search</h1>
      {q ? (
        <Suspense fallback={<ProductGridSkeleton />}>
          <SearchResults q={q} />
        </Suspense>
      ) : (
        <p className="text-sm text-muted">Enter a search term to find products.</p>
      )}
    </div>
  );
}
