import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}

async function ShopResults({ category, sort, page }: { category?: string; sort?: string; page: number }) {
  const result = await getProducts({ category, sort, page, limit: 16 });

  return (
    <>
      <ProductGrid products={result.items} />
      {result.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination currentPage={result.page} totalPages={result.totalPages} />
        </div>
      )}
    </>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categories = await getCategories();
  const page = Number(params.page ?? 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Banner */}
      <div className="mb-6">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Catalog</span>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mt-1">
          Explore Our Collection
        </h1>
        <p className="text-sm text-muted mt-1 max-w-lg">
          Discover verified products from top brands across Kenya with express shipping and secure payment.
        </p>
      </div>

      {/* Filter Controls */}
      <ProductFilters categories={categories} />

      {/* Product Results */}
      <div className="pt-2">
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopResults category={params.category} sort={params.sort} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
