import {
  pgTable,
  serial,
  text,
  timestamp,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const jobTypeEnum = pgEnum('job_type', [
  'Internship',
  'Full-time',
  'Part-time',
]);

export const statusEnum = pgEnum('status', [
  'Applied',
  'Interviewing',
  'Offer',
  'Rejected',
]);

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  company_name: text('company_name').notNull(),
  job_title: text('job_title').notNull(),
  job_type: jobTypeEnum('job_type').notNull(),
  status: statusEnum('status').notNull(),
  applied_date: date('applied_date').notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export type ApplicationSelect = typeof applications.$inferSelect;
export type ApplicationInsert = typeof applications.$inferInsert;
