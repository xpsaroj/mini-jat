'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useApplication } from '@/hooks/useApplication';
import { updateApplication, deleteApplication } from '@/lib/api';
import type { CreateApplicationInput } from '@/types';
import { ApplicationForm } from './ApplicationForm';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatIsoDate } from '@/lib/utils';


function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div>
      <Skeleton className="mb-8 h-4 w-32" />
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6 rounded-lg border border-border bg-surface p-6 shadow-sm">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-3 gap-4 border-y border-border py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
interface Props {
  id: number;
}

export function ApplicationDetail({ id }: Props) {
  const router = useRouter();
  const { data, loading, error, refetch } = useApplication(id);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Update
  const handleUpdate = async (formData: CreateApplicationInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateApplication(id, formData);
      await refetch();
      setMode('view');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteApplication(id);
      router.push('/applications');
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed.');
      setIsDeleting(false);
    }
  }, [id, router]);

  // Loading / error states
  if (loading) return <DetailSkeleton />;

  if (error !== null || data === null) {
    return (
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
        <ChevronLeft className="h-4 w-4" />
          All Applications
        </Link>
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive-bg px-4 py-3 text-sm text-destructive">
          {error ?? 'Application not found.'}
        </div>
      </div>
    );
  }

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
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          {/* Card header */}
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {data.company_name}
              </h1>
              <p className="mt-0.5 text-sm text-foreground-secondary">
                {data.job_title}
              </p>
            </div>
            <StatusBadge status={data.status} className="mt-0.5 shrink-0" />
          </div>

          {/* Card body */}
          {mode === 'view' ? (
            <div className="space-y-5 px-6 py-5">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <InfoItem label="Job Type" value={data.job_type} />
                <InfoItem
                  label="Applied Date"
                  value={formatDate(data.applied_date)}
                />
                <InfoItem label="Added" value={formatIsoDate(data.created_at)} />
              </div>

              {/* Notes */}
              {data.notes !== null && data.notes !== '' && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    Notes
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground-secondary">
                    {data.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 border-t border-border pt-4">
                <Button
                  variant="outline"
                  id="btn-edit"
                  onClick={() => {
                    setSubmitError(null);
                    setMode('edit');
                  }}
                >
                  Edit Application
                </Button>
                <Button
                  variant="destructive"
                  id="btn-delete"
                  onClick={() => {
                    setDeleteError(null);
                    setShowDelete(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-5">
              <p className="mb-4 text-sm font-semibold text-foreground">
                Edit Application
              </p>
              <ApplicationForm
                mode="edit"
                initialValues={{
                  company_name: data.company_name,
                  job_title:    data.job_title,
                  job_type:     data.job_type,
                  status:       data.status,
                  applied_date: data.applied_date,
                  notes:        data.notes ?? undefined,
                }}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setMode('view');
                  setSubmitError(null);
                }}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => {
          if (!isDeleting) setShowDelete(false);
        }}
        title="Delete Application"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              id="btn-cancel-delete"
              onClick={() => setShowDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              id="btn-confirm-delete"
              isLoading={isDeleting}
              onClick={() => void handleDelete()}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground-secondary">
          Are you sure you want to delete the application for{' '}
          <strong>{data.job_title}</strong> at{' '}
          <strong>{data.company_name}</strong>? This cannot be undone.
        </p>
        {deleteError !== null && (
          <p className="mt-2 text-sm text-destructive">{deleteError}</p>
        )}
      </Modal>
    </div>
  );
}
