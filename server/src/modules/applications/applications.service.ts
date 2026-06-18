import { eq, ilike, or, and, count, desc } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { applications } from '../../db/schema.js';
import type { ApplicationSelect, ApplicationInsert } from '../../db/schema.js';
import { ApiError } from '../../middleware/errorHandler.js';
import type { PaginatedResponse } from '../../types/index.js';

interface GetAllFilters {
  status?: ApplicationSelect['status'] | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

// Explicit | undefined on every optional field so exactOptionalPropertyTypes
// accepts values like `{ company_name: undefined }` from partial zod output.
type ApplicationUpdate = {
  company_name?: string | undefined;
  job_title?: string | undefined;
  job_type?: 'Internship' | 'Full-time' | 'Part-time' | undefined;
  status?: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | undefined;
  applied_date?: string | undefined;
  notes?: string | null | undefined;
};


/**
 * Get all applications.
 * @param filters - Filters to apply to the query.
 * @returns - Paginated response.
 */
export async function getAllApplications(
  filters: GetAllFilters,
): Promise<PaginatedResponse<ApplicationSelect>> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  // drizzle's eq/ilike/or return SQL<unknown>
  const conditions: SQL<unknown>[] = [];

  if (filters.status !== undefined) {
    conditions.push(eq(applications.status, filters.status));
  }

  if (filters.search !== undefined && filters.search.trim() !== '') {
    const term = `%${filters.search.trim()}%`;
    const searchOr = or(
      ilike(applications.company_name, term),
      ilike(applications.job_title, term),
    );
    if (searchOr !== undefined) {
      conditions.push(searchOr);
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const countRows = await db
    .select({ total: count() })
    .from(applications)
    .where(whereClause);

  const total = countRows[0]?.total ?? 0;

  const data = await db
    .select()
    .from(applications)
    .where(whereClause)
    .orderBy(desc(applications.created_at))
    .limit(limit)
    .offset(offset);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


/**
 * Get an application by ID.
 * @param id - Id of the application.
 * @returns - Application if found, throws 404 error if not found.
 */
export async function getApplicationById(id: number): Promise<ApplicationSelect> {
  const rows = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  const app = rows[0];
  if (app === undefined) {
    throw new ApiError(`Application with id ${id} not found`, 404);
  }

  return app;
}


/**
 * Create an application.
 * @param data - Data to create application.
 * @returns - Created application.
 */
export async function createApplication(
  data: ApplicationInsert,
): Promise<ApplicationSelect> {
  const rows = await db.insert(applications).values(data).returning();
  const created = rows[0];

  if (created === undefined) {
    throw new ApiError('Failed to create application', 500);
  }

  return created;
}


/**
 * Update an application.
 * @param id - Id of the application.
 * @param data - Data to update application.
 * @returns - Updated application.
 */
export async function updateApplication(
  id: number,
  data: ApplicationUpdate,
): Promise<ApplicationSelect> {
  await getApplicationById(id);

  const rows = await db
    .update(applications)
    .set({ ...data, updated_at: new Date() })
    .where(eq(applications.id, id))
    .returning();

  const updated = rows[0];
  if (updated === undefined) {
    throw new ApiError('Failed to update application', 500);
  }

  return updated;
}


/**
 * Delete an application.
 * @param id - Id of the application.
 * @returns - Success message.
 */
export async function deleteApplication(id: number): Promise<{ success: true }> {
  await getApplicationById(id);

  await db.delete(applications).where(eq(applications.id, id));

  return { success: true };
}
