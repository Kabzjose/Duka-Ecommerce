interface PriceProps {
  amount: number;
  originalAmount?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDiscountBadge?: boolean;
  className?: string;
}

const sizeStyles = {
  xs: 'text-xs',
  sm: 'text-sm font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-xl font-bold',
  xl: 'text-2xl md:text-3xl font-bold',
};

export function Price({ amount, originalAmount, size = 'md', showDiscountBadge = false, className = '' }: PriceProps) {
  const hasDiscount = originalAmount && originalAmount > amount;
  const discountPercent = hasDiscount ? Math.round(((originalAmount - amount) / originalAmount) * 100) : 0;

  return (
    <div className={`flex items-baseline flex-wrap gap-1.5 ${className}`}>
      <span className={`font-mono tracking-tight text-ink ${sizeStyles[size]}`}>
        <span className="text-muted text-[0.75em] font-sans font-medium mr-1">KES</span>
        {amount.toLocaleString('en-KE')}
      </span>
      {hasDiscount && (
        <span className="font-mono text-muted/70 line-through text-xs sm:text-sm">
          KES {originalAmount.toLocaleString('en-KE')}
        </span>
      )}
      {hasDiscount && showDiscountBadge && (
        <span className="ml-1 rounded bg-accent-light px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}