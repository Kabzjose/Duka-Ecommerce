export function ProductCardSkeleton() {
  return (
    <div className="border border-border rounded overflow-hidden animate-pulse">
      <div className="aspect-square bg-border/60" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 w-1/3 bg-border/60 rounded" />
        <div className="h-3.5 w-3/4 bg-border/60 rounded" />
        <div className="h-4 w-1/2 bg-border/60 rounded" />
        <div className="h-8 w-full bg-border/60 rounded mt-3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}