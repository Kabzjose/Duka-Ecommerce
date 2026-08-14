import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';

export default async function DealsPage() {
  const result = await getProducts({ limit: 20 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-1">Deals</h1>
      <p className="text-sm text-muted mb-6">Discount pricing is coming soon — here&apos;s our full catalog for now.</p>
      <ProductGrid products={result.items} />
    </div>
  );
}
