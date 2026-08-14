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
  const result = await getProducts({ category, sort, page, limit: 20 });
  if (result.items.length === 0) {
    return <p className="text-sm text-muted py-16 text-center">No products match these filters.</p>;
  }
  return (
    <>
      <ProductGrid products={result.items} />
      <Pagination currentPage={result.page} totalPages={result.totalPages} />
    </>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categories = await getCategories();
  const page = Number(params.page ?? 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-1">Shop</h1>
      <p className="text-sm text-muted mb-4">Browse all products</p>
      <ProductFilters categories={categories} />
      <div className="pt-6">
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopResults category={params.category} sort={params.sort} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
