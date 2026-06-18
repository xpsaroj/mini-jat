'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationFormSchema, type ApplicationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { CreateApplicationInput } from '@/types';

interface ApplicationFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<ApplicationFormData>;
  onSubmit: (data: CreateApplicationInput) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitError?: string | null;
}

export function ApplicationForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      company_name: initialValues?.company_name ?? '',
      job_title:    initialValues?.job_title    ?? '',
      job_type:     initialValues?.job_type     ?? 'Full-time',
      status:       initialValues?.status       ?? 'Applied',
      applied_date: initialValues?.applied_date ?? '',
      notes:        initialValues?.notes        ?? '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => void onSubmit(data))}
      noValidate
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="company_name"
          label="Company Name"
          placeholder="e.g. Acme Corp"
          {...register('company_name')}
          error={errors.company_name?.message}
        />
        <Input
          id="job_title"
          label="Job Title"
          placeholder="e.g. Software Engineer"
          {...register('job_title')}
          error={errors.job_title?.message}
        />
        <Select
          id="job_type"
          label="Job Type"
          {...register('job_type')}
          error={errors.job_type?.message}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </Select>
        <Select
          id="status"
          label="Status"
          {...register('status')}
          error={errors.status?.message}
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </Select>
        <Input
          id="applied_date"
          label="Applied Date"
          type="date"
          {...register('applied_date')}
          error={errors.applied_date?.message}
        />
      </div>

      <Textarea
        id="notes"
        label="Notes (optional)"
        placeholder="Any notes about this application..."
        rows={4}
        {...register('notes')}
        error={errors.notes?.message}
      />

      {submitError && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          isLoading={isSubmitting}
          id={`btn-${mode}-submit`}
        >
          {mode === 'create' ? 'Add Application' : 'Save Changes'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            id="btn-form-cancel"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
