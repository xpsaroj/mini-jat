import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const baseClasses = [
  'w-full rounded-md border px-3 py-2 text-sm text-foreground bg-surface',
  'placeholder:text-foreground-muted',
  'border-border outline-none resize-y min-h-24',
  'focus:border-accent focus:ring-2 focus:ring-accent/20',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-colors',
].join(' ');

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={[
          baseClasses,
          error
            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
            : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  ),
);
Textarea.displayName = 'Textarea';
