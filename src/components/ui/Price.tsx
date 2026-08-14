interface PriceProps {
  amount: number;
  originalAmount?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function Price({ amount, originalAmount, size = 'md' }: PriceProps) {
  const hasDiscount = originalAmount && originalAmount > amount;

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-mono font-medium ${sizeStyles[size]}`}>
        <span className="text-muted text-[0.7em] mr-1">KES</span>
        {amount.toLocaleString('en-KE')}
      </span>
      {hasDiscount && (
        <span className="font-mono text-muted line-through text-sm">
          {originalAmount.toLocaleString('en-KE')}
        </span>
      )}
    </div>
  );
}