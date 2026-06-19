import { describe, it, expect, vi } from 'vitest';
import type { ApplicationInsert, ApplicationSelect } from '../../../db/schema.js';

// Stub data used inside the mock factory (defined before vi.mock hoisting)
const stubApp: ApplicationSelect = {
  id: 1,
  company_name: 'Acme Inc',
  job_title: 'Software Engineer',
  job_type: 'Full-time',
  status: 'Applied',
  applied_date: '2024-01-15',
  notes: null,
  created_at: new Date('2024-01-15T00:00:00.000Z'),
  updated_at: new Date('2024-01-15T00:00:00.000Z'),
};

// Mock the database module — no live DB required
vi.mock('../../../db/index.js', () => {
  return {
    db: {
      insert: () => ({
        values: () => ({
          returning: () => Promise.resolve([stubApp]),
        }),
      }),
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([stubApp]),
          }),
        }),
      }),
      update: () => ({
        set: () => ({
          where: () => ({
            returning: () => Promise.resolve([{ ...stubApp, status: 'Interviewing' as const }]),
          }),
        }),
      }),
      delete: () => ({
        where: () => Promise.resolve(),
      }),
    },
  };
});

// Import service AFTER vi.mock is set up (vitest hoists vi.mock automatically)
const { createApplication, getApplicationById } =
  await import('../applications.service.js');

  
// Tests
describe('applications.service', () => {
  describe('createApplication', () => {
    const validInput: ApplicationInsert = {
      company_name: 'Acme Inc',
      job_title: 'Software Engineer',
      job_type: 'Full-time',
      status: 'Applied',
      applied_date: '2024-01-15',
    };

    it('should return the created application', async () => {
      const result = await createApplication(validInput);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.company_name).toBe('Acme Inc');
      expect(result.job_title).toBe('Software Engineer');
      expect(result.job_type).toBe('Full-time');
      expect(result.status).toBe('Applied');
    });

    it('should return applied_date in string format', async () => {
      const result = await createApplication(validInput);
      expect(typeof result.applied_date).toBe('string');
    });

    it('should return notes as null when not provided', async () => {
      const result = await createApplication(validInput);
      expect(result.notes).toBeNull();
    });
  });

  describe('getApplicationById', () => {
    it('should return the application when found', async () => {
      const result = await getApplicationById(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });
  });
});
