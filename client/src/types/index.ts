export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
export type ApplicationJobType = 'Internship' | 'Full-time' | 'Part-time';

export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  job_type: ApplicationJobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  company_name: string;
  job_title: string;
  job_type: ApplicationJobType;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
}

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorBody {
  error: true;
  message: string;
  details?: Record<string, string>;
}
