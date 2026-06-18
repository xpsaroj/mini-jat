'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const isApps = pathname.startsWith('/applications');

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-border bg-surface">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/applications"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
            <svg
              className="h-4 w-4 text-accent-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
              />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Job Tracker
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/applications"
            id="nav-applications"
            className={[
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isApps
                ? 'bg-accent-subtle text-accent'
                : 'text-foreground-secondary hover:bg-muted hover:text-foreground',
            ].join(' ')}
          >
            Applications
          </Link>
        </nav>
      </div>
    </header>
  );
}
