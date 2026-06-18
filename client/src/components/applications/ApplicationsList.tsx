'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useApplications } from '@/hooks/useApplications';
import { deleteApplication } from '@/lib/api';
import type { Application, ApplicationStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ApplicationStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

// ─── Subcomponents ────────────────────────────────────────────────────────

interface RowProps {
  application: Application;
  onDeleteClick: (id: number) => void;
}

function ApplicationRow({ application, onDeleteClick }: RowProps) {
  return (
    <tr className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
      <td className="px-4 py-3.5">
        <span className="font-medium text-foreground">
          {application.company_name}
        </span>
      </td>
      <td className="px-4 py-3.5 text-foreground-secondary">
        {application.job_title}
      </td>
      <td className="hidden px-4 py-3.5 text-foreground-muted sm:table-cell">
        {application.job_type}
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={application.status} />
      </td>
      <td className="hidden px-4 py-3.5 text-sm text-foreground-muted md:table-cell">
        {formatDate(application.applied_date)}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <Link href={`/applications/${application.id}`}>
            <Button
              variant="ghost"
              size="sm"
              id={`btn-view-${application.id}`}
            >
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            id={`btn-delete-${application.id}`}
            className="text-destructive hover:bg-destructive-bg hover:text-destructive"
            onClick={() => onDeleteClick(application.id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3.5"><Skeleton className="h-4 w-32" /></td>
      <td className="px-4 py-3.5"><Skeleton className="h-4 w-40" /></td>
      <td className="hidden px-4 py-3.5 sm:table-cell"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-3.5"><Skeleton className="h-5 w-24 rounded-full" /></td>
      <td className="hidden px-4 py-3.5 md:table-cell"><Skeleton className="h-4 w-24" /></td>
      <td className="px-4 py-3.5"><Skeleton className="ml-auto h-7 w-28" /></td>
    </tr>
  );
}

function getPageRange(current: number, total: number): number[] {
  const delta = 2;
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// ─── Main component ───────────────────────────────────────────────────────

export function ApplicationsList() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [page, setPage] = useState(1);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Debounce search input (350 ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data, loading, error, refetch } = useApplications({
    status: status !== '' ? status : undefined,
    search: debouncedSearch !== '' ? debouncedSearch : undefined,
    page,
    limit: 10,
  });

  // ─── Delete handlers ────────────────────────────────────────────────
  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteError(null);
  };

  const closeDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setDeleteId(null);
      setDeleteError(null);
    }
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteApplication(deleteId);
      setDeleteId(null);
      void refetch();
      setSuccessMsg('Application deleted successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      setDeleteError(
        e instanceof Error ? e.message : 'Failed to delete application.',
      );
    } finally {
      setIsDeleting(false);
    }
  }, [deleteId, refetch]);

  const totalPages = data?.totalPages ?? 1;
  const pageRange = getPageRange(page, totalPages);

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Job Applications
          </h1>
          {data !== null && (
            <p className="mt-1 text-sm text-foreground-muted">
              {data.total}{' '}
              {data.total === 1 ? 'application' : 'applications'} total
            </p>
          )}
        </div>
        <Link href="/applications/new">
          <Button id="btn-add-application" className="shrink-0">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Application
          </Button>
        </Link>
      </div>

      {/* ── Success banner ────────────────────────────────────────────── */}
      {successMsg !== null && (
        <div className="mb-4 rounded-md border border-accent/30 bg-accent-subtle px-4 py-3 text-sm text-accent">
          {successMsg}
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            id="search-input"
            placeholder="Search by company or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            id="status-filter"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ApplicationStatus | '')
            }
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* ── API error ─────────────────────────────────────────────────── */}
      {error !== null && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive-bg px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                {[
                  { label: 'Company', className: '' },
                  { label: 'Job Title', className: '' },
                  { label: 'Type', className: 'hidden sm:table-cell' },
                  { label: 'Status', className: '' },
                  { label: 'Applied', className: 'hidden md:table-cell' },
                  { label: 'Actions', className: 'text-right' },
                ].map(({ label, className }) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted ${className}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center">
                    <p className="font-medium text-foreground-secondary">
                      No applications found
                    </p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      {search !== '' || status !== ''
                        ? 'Try adjusting your search or filter.'
                        : 'Add your first application to get started.'}
                    </p>
                    {search === '' && status === '' && (
                      <Link href="/applications/new" className="mt-4 inline-block">
                        <Button size="sm" id="btn-empty-add">
                          Add Application
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                data?.data.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    onDeleteClick={openDeleteModal}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ────────────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            Page {page} of {totalPages}
            {data !== null && ` · ${data.total} results`}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              id="btn-prev-page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {pageRange.map((n) => (
              <Button
                key={n}
                variant={page === n ? 'default' : 'ghost'}
                size="sm"
                id={`btn-page-${n}`}
                onClick={() => setPage(n)}
              >
                {n}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              id="btn-next-page"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────── */}
      <Modal
        isOpen={deleteId !== null}
        onClose={closeDeleteModal}
        title="Delete Application"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              id="btn-cancel-delete"
              onClick={closeDeleteModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              id="btn-confirm-delete"
              isLoading={isDeleting}
              onClick={() => void confirmDelete()}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground-secondary">
          Are you sure you want to delete this application? This action
          cannot be undone.
        </p>
        {deleteError !== null && (
          <p className="mt-2 text-sm text-destructive">{deleteError}</p>
        )}
      </Modal>
    </div>
  );
}
