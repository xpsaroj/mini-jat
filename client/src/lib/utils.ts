/** Format a YYYY-MM-DD date string to a human-readable label. */
export function formatDate(dateStr: string): string {
  try {
    // Add T00:00:00 to avoid UTC offset shifting the date by one day
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

/** Merge class names, filtering out falsy values. */
export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(' ');
}
