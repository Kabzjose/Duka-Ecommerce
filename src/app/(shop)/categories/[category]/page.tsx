import { Suspense } from 'react';
import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';

async function CategoryResults({ category }: { category: string }) {
  const result = await getProducts({ category, limit: 20 });
  return <ProductGrid products={result.items} />;
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">{decoded}</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <CategoryResults category={decoded} />
      </Suspense>
    </div>
  );
}
