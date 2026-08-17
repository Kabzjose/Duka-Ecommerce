import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getProducts } from '@/lib/products';
import { Price } from '@/components/ui/Price';
import { ProductGrid } from '@/components/products/ProductGrid';
import { AddToCartPanel } from '@/components/products/AddToCartPanel';
import { ChevronRight, ShieldCheck, Truck, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getProducts({ category: product.category, limit: 5 });
  const relatedFiltered = related.items.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/categories/${encodeURIComponent(product.category)}`} className="hover:text-ink">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink font-bold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6">
          <div className="sticky top-28 space-y-4">
            <div className="relative aspect-square rounded-2xl bg-surface border border-border overflow-hidden shadow-card group">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted text-sm font-mono">
                  No image available
                </div>
              )}

              {product.stockQuantity === 0 && (
                <div className="absolute top-4 left-4 bg-ink text-white text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded shadow">
                  OUT OF STOCK
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Product Purchase Info & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-brand bg-brand-light px-2.5 py-1 rounded mb-3">
              {product.category}
            </span>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink leading-snug">
              {product.name}
            </h1>

            {/* Price Display */}
            <div className="mt-4 pt-4 border-t border-border-subtle flex items-baseline gap-4">
              <Price amount={product.price} size="xl" />
            </div>

            {/* Stock Availability Indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
              {product.stockQuantity > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-brand font-semibold bg-brand-light px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4" /> In Stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-danger font-semibold bg-danger-light px-2.5 py-1 rounded-full">
                  <AlertCircle className="h-4 w-4" /> Currently Out of Stock
                </span>
              )}
            </div>

            {/* Product Short Description */}
            <div className="mt-6 text-sm text-ink/80 leading-relaxed font-sans bg-surface p-4 rounded-xl border border-border-subtle">
              <p>{product.description || 'Premium genuine product sourced directly from verified retail distributors.'}</p>
            </div>

            {/* Interactive Purchase Controls */}
            <AddToCartPanel product={product} />

            {/* Retail Trust Perks */}
            <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-border-subtle text-center">
              <div className="p-3 rounded-xl bg-bg border border-border-subtle flex flex-col items-center">
                <Truck className="h-5 w-5 text-brand mb-1" />
                <span className="text-[11px] font-bold text-ink">Fast Delivery</span>
                <span className="text-[10px] text-muted mt-0.5">Nairobi & Countrywide</span>
              </div>
              <div className="p-3 rounded-xl bg-bg border border-border-subtle flex flex-col items-center">
                <ShieldCheck className="h-5 w-5 text-brand mb-1" />
                <span className="text-[11px] font-bold text-ink">100% Genuine</span>
                <span className="text-[10px] text-muted mt-0.5">Verified Quality</span>
              </div>
              <div className="p-3 rounded-xl bg-bg border border-border-subtle flex flex-col items-center">
                <RefreshCcw className="h-5 w-5 text-brand mb-1" />
                <span className="text-[11px] font-bold text-ink">Easy Returns</span>
                <span className="text-[10px] text-muted mt-0.5">7-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedFiltered.length > 0 && (
        <section className="mt-20 pt-10 border-t border-border">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Recommendations</span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mt-1">
                Related Products
              </h2>
            </div>
            <Link
              href={`/categories/${encodeURIComponent(product.category)}`}
              className="text-xs font-bold uppercase tracking-wider text-brand hover:underline flex items-center gap-1"
            >
              More in {product.category} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ProductGrid products={relatedFiltered} />
        </section>
      )}
    </div>
  );
}
