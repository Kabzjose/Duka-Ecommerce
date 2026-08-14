'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { CategoryCount } from '@/lib/types';

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function ProductFilters({ categories }: { categories: CategoryCount[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/shop?${params.toString()}`);
  }

  const activeCategory = searchParams.get('category') ?? '';
  const activeSort = searchParams.get('sort') ?? '';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between py-4 border-b border-border">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam('category', '')}
          className={`px-3 py-1.5 rounded text-sm border ${!activeCategory ? 'bg-ink text-white border-ink' : 'border-border text-muted hover:border-ink'}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.category}
            onClick={() => setParam('category', c.category)}
            className={`px-3 py-1.5 rounded text-sm border ${activeCategory === c.category ? 'bg-ink text-white border-ink' : 'border-border text-muted hover:border-ink'}`}
          >
            {c.category}
          </button>
        ))}
      </div>
      <select
        value={activeSort}
        onChange={(e) => setParam('sort', e.target.value)}
        className="rounded border border-border bg-white/60 px-3 py-1.5 text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
