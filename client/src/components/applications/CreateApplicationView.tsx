'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createApplication } from '@/lib/api';
import type { CreateApplicationInput } from '@/types';
import { ApplicationForm } from './ApplicationForm';
import { Button } from '@/components/ui/Button';


export function CreateApplicationView() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateApplicationInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await createApplication(data);
      router.push(`/applications/${result.data.id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to create application.',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        All Applications
      </Link>

      <div className="mt-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add Application
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Track a new job application.
        </p>

        <div className="mt-6 rounded-lg border border-border bg-surface p-6 shadow-sm">
          <ApplicationForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
            submitError={error}
          />
        </div>
      </div>
    </div>
  );
}
