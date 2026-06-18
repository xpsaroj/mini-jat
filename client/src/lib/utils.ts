/** Format a YYYY-MM-DD date string to a human-readable label. */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Format a full ISO 8601 date-time string to a human-readable label. */
export function formatIsoDate(isoStr: string): string {
  try {
    return new Date(isoStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoStr;
  }
}

/** Merge class names, filtering out falsy values. */
export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(' ');
}
