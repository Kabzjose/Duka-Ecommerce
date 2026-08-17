import { Suspense } from 'react';
import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';
import { Search } from 'lucide-react';

async function SearchResults({ q }: { q: string }) {
  const result = await getProducts({ search: q, limit: 24 });
  if (result.items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto border border-border-subtle rounded-2xl bg-surface p-8 shadow-subtle">
        <Search className="h-10 w-10 text-muted mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-bold text-ink">No results found for &quot;{q}&quot;</h3>
        <p className="text-sm text-muted mt-2">
          We couldn&apos;t find any products matching your query. Try checking your spelling or searching for a broader term like &quot;electronics&quot;.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
        <p className="text-sm font-mono text-muted">
          Showing <span className="font-bold text-ink">{result.total}</span> result{result.total !== 1 ? 's' : ''} for &quot;<span className="text-brand font-semibold">{q}</span>&quot;
        </p>
      </div>
      <ProductGrid products={result.items} />
    </>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Search Catalog</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink mt-1">
          Search Results
        </h1>
      </div>

      {q ? (
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <SearchResults q={q} />
        </Suspense>
      ) : (
        <div className="py-16 text-center text-muted">
          <p className="text-sm">Type a product name or category in the search bar above.</p>
        </div>
      )}
    </div>
  );
}
