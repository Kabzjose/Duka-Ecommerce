import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, required, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-ink/80">
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={`rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-all duration-150 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-subtle ${
            error ? 'border-danger focus:ring-danger/20' : 'border-border'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-muted">{hint}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
