import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';
import { PackageX } from 'lucide-react';

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center border border-border-subtle rounded-xl bg-surface p-8">
        <PackageX className="h-10 w-10 text-muted mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-semibold text-ink">No products found</h3>
        <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
          We couldn't find any products matching your current search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}