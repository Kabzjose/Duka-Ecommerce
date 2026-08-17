import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Tag, Sparkles } from 'lucide-react';

export default async function DealsPage() {
  const result = await getProducts({ limit: 20 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Deals Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-accent-dark via-accent to-brand text-white p-8 md:p-10 mb-8 shadow-card relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5" /> EXCLUSIVE DISCOUNTS & SAVINGS
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Today&apos;s Hot Deals
          </h1>
          <p className="text-sm md:text-base text-white/90 mt-2 max-w-xl">
            Grab special promotional pricing across top categories. Updated daily with direct savings on genuine retail products.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold text-ink">Special Offers & Bundles</h2>
        </div>
        <span className="text-xs font-mono text-muted">{result.items.length} offers available</span>
      </div>

      <ProductGrid products={result.items} />
    </div>
  );
}
