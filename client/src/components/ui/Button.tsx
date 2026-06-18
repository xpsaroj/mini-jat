import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default:
    'bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm',
  outline:
    'border border-border bg-surface text-foreground hover:bg-muted shadow-sm',
  ghost:
    'text-foreground hover:bg-muted',
  destructive:
    'bg-destructive text-white hover:opacity-90 shadow-sm',
  link:
    'text-accent underline-offset-4 hover:underline p-0 h-auto font-normal',
};

const sizeClasses: Record<Size, string> = {
  sm:   'h-8  px-3  text-xs  rounded-md',
  md:   'h-9  px-4  text-sm  rounded-md',
  lg:   'h-11 px-6  text-sm  rounded-lg',
  icon: 'h-9  w-9          rounded-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    const isLink = variant === 'link';
    return (
      <button
        ref={ref}
        disabled={disabled ?? isLoading}
        className={[
          'inline-flex items-center justify-center gap-2 font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          !isLink && sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
