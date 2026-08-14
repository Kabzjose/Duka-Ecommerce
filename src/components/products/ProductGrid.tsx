import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-muted py-12 text-center">No products to show.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}