import Link from 'next/link';
import { getCategories } from '@/lib/products';
import { LayoutGrid, ChevronRight } from 'lucide-react';

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Browse Navigation</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink mt-1">
          Product Categories
        </h1>
        <p className="text-sm text-muted mt-1">Explore our full range of curated retail departments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/categories/${encodeURIComponent(c.category)}`}
            className="group relative flex items-center justify-between p-6 rounded-2xl border border-border bg-surface hover:bg-brand-light/50 hover:border-brand/40 transition-all duration-200 shadow-subtle hover:shadow-card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-bg text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-ink group-hover:text-brand transition-colors">
                  {c.category}
                </h3>
                <p className="text-xs text-muted font-mono mt-0.5">{c.count} items</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
