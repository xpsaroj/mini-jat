import { z } from 'zod';

const JOB_TYPES = ['Internship', 'Full-time', 'Part-time'] as const;
const STATUSES  = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

export const applicationFormSchema = z.object({
  company_name: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name is too long'),
  job_title: z
    .string()
    .min(1, 'Job title is required')
    .max(200, 'Job title is too long'),
  job_type: z.enum(JOB_TYPES, { error: 'Invalid job type' }),
  status:   z.enum(STATUSES,  { error: 'Invalid status' }),
  applied_date: z
    .string()
    .min(1, 'Applied date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  notes: z.string().max(2000, 'Notes too long').optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
