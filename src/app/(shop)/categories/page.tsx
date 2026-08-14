import Link from 'next/link';
import { getCategories } from '@/lib/products';

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link key={c.category} href={`/categories/${encodeURIComponent(c.category)}`} className="border border-border rounded p-6 text-center hover:border-brand transition-colors bg-white/40">
            <p className="font-medium">{c.category}</p>
            <p className="text-sm text-muted mt-1">{c.count} products</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
