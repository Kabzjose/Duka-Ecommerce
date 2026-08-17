"use client";

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary: 'bg-brand text-white shadow-subtle hover:bg-brand-dark active:scale-[0.99] shadow-sm',
  secondary: 'bg-white border border-border text-ink hover:bg-bg hover:border-ink/40 active:scale-[0.99] shadow-subtle',
  ghost: 'bg-transparent text-ink hover:bg-black/5 active:scale-[0.99]',
  danger: 'bg-danger text-white hover:bg-danger/90 active:scale-[0.99] shadow-sm',
  accent: 'bg-accent text-white hover:bg-accent-dark active:scale-[0.99] shadow-sm',
};

const sizeStyles = {
  sm: 'px-3.5 py-1.5 text-xs font-medium tracking-wide',
  md: 'px-4 py-2.5 text-sm font-medium',
  lg: 'px-6 py-3.5 text-base font-semibold tracking-tight',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-md font-sans
          transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
          ${variantStyles[variant]} ${sizeStyles[size]} ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
