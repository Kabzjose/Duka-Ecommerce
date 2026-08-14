import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/products';
import { Price } from '@/components/ui/Price';
import { ProductGrid } from '@/components/products/ProductGrid';
import { AddToCartPanel } from '@/components/products/AddToCartPanel';
import Image from 'next/image';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getProducts({ category: product.category, limit: 4 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-brand-light rounded overflow-hidden relative">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">No image</div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted mb-2">{product.category}</p>
          <h1 className="font-display text-2xl font-semibold mb-3">{product.name}</h1>
          <Price amount={product.price} size="lg" />
          <p className="text-sm text-muted mt-4 leading-relaxed">{product.description}</p>
          <p className="text-sm mt-4">
            {product.stockQuantity > 0 ? (
              <span className="text-brand">In stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="text-danger">Out of stock</span>
            )}
          </p>
          <AddToCartPanel product={product} />
        </div>
      </div>

      {related.items.length > 1 && (
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-lg font-medium mb-4">Related Products</h2>
          <ProductGrid products={related.items.filter((p) => p.id !== product.id).slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
