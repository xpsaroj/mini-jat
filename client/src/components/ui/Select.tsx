import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const baseClasses = [
  'h-9 w-full rounded-md border px-3 pr-8 text-sm text-foreground bg-surface',
  'border-border outline-none appearance-none',
  'focus:border-accent focus:ring-2 focus:ring-accent/20',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-colors',
].join(' ');

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, children, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={[baseClasses, error ? 'border-destructive' : '', className]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
          <ChevronDown className="h-4 w-4 text-foreground-muted" />
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  ),
);
Select.displayName = 'Select';
