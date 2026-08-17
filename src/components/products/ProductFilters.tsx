'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { CategoryCount } from '@/lib/types';
import { SlidersHorizontal, X } from 'lucide-react';

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'newest', label: 'Newest Arrivals' },
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-border-subtle bg-surface px-4 rounded-xl shadow-subtle mb-6">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        <span className="text-xs font-mono font-bold uppercase text-muted tracking-wider mr-2 hidden sm:inline">
          Categories:
        </span>
        <button
          onClick={() => setParam('category', '')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            !activeCategory
              ? 'bg-brand text-white shadow-sm'
              : 'bg-bg text-ink hover:bg-border/60 border border-border'
          }`}
        >
          All Items
        </button>
        {categories.map((c) => {
          const active = activeCategory === c.category;
          return (
            <button
              key={c.category}
              onClick={() => setParam('category', c.category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-bg text-ink hover:bg-border/60 border border-border'
              }`}
            >
              <span>{c.category}</span>
              <span className={`text-[10px] font-mono rounded px-1 ${active ? 'bg-white/20 text-white' : 'bg-black/5 text-muted'}`}>
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Sort & Clear */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
        {(activeCategory || activeSort) && (
          <button
            onClick={() => {
              router.push('/shop');
            }}
            className="text-xs font-medium text-danger hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" /> Reset Filters
          </button>
        )}

        <div className="flex items-center gap-2 bg-bg border border-border rounded-lg px-3 py-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted" />
          <select
            value={activeSort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="bg-transparent text-xs font-semibold text-ink focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
