export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden animate-pulse">
      <div className="aspect-square bg-border/40" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-border/40 rounded" />
        <div className="h-4 w-5/6 bg-border/40 rounded" />
        <div className="h-5 w-1/2 bg-border/40 rounded" />
        <div className="h-9 w-full bg-border/40 rounded-lg mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}