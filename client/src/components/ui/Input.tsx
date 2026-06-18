import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const baseClasses = [
  'h-9 w-full rounded-md border px-3 text-sm text-foreground bg-surface',
  'placeholder:text-foreground-muted',
  'border-border outline-none',
  'focus:border-accent focus:ring-2 focus:ring-accent/20',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-colors',
].join(' ');

const errorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive/20';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[baseClasses, error ? errorClasses : '', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
