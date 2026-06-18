import type { ApplicationStatus } from '@/types';

// Status Badge
const statusStyles: Record<
  ApplicationStatus,
  { bg: string; text: string }
> = {
  Applied: {
    bg: 'bg-status-applied-bg',
    text: 'text-status-applied',
  },
  Interviewing: {
    bg: 'bg-status-interviewing-bg',
    text: 'text-status-interviewing',
  },
  Offer: {
    bg: 'bg-status-offer-bg',
    text: 'text-status-offer',
  },
  Rejected: {
    bg: 'bg-status-rejected-bg',
    text: 'text-status-rejected',
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { bg, text } = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${bg} ${text} ${className}`}
    >
      {status}
    </span>
  );
}

// General Badge
type BadgeVariant = 'default' | 'muted' | 'outline';

const badgeVariantStyles: Record<BadgeVariant, string> = {
  default: 'bg-accent-subtle text-accent',
  muted: 'bg-muted text-foreground-muted',
  outline: 'border border-border text-foreground-secondary',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${badgeVariantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
