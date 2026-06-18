import { z } from 'zod';

export const jobTypeValues = ['Internship', 'Full-time', 'Part-time'] as const;
export const statusValues = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

export const createApplicationSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  job_title: z.string().min(1, 'Job title is required'),
  job_type: z.enum(jobTypeValues, { error: 'Invalid job type' }),
  status: z.enum(statusValues, { error: 'Invalid status' }),
  applied_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Applied date must be in YYYY-MM-DD format'),
  notes: z.string().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const querySchema = z.object({
  status: z.enum(statusValues).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type QueryInput = z.infer<typeof querySchema>;
