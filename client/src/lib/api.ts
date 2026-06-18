import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  PaginatedResponse,
  ApplicationStatus,
} from '@/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

// ─── Generic fetch wrapper ────────────────────────────────────────────────
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore JSON parse error — use default message
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Endpoint helpers ─────────────────────────────────────────────────────

export interface GetApplicationsParams {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export function getApplications(
  params?: GetApplicationsParams,
): Promise<PaginatedResponse<Application>> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.search) qs.set('search', params.search);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return apiFetch<PaginatedResponse<Application>>(
    `/applications${query ? `?${query}` : ''}`,
  );
}

export function getApplication(id: number): Promise<{ data: Application }> {
  return apiFetch<{ data: Application }>(`/applications/${id}`);
}

export function createApplication(
  data: CreateApplicationInput,
): Promise<{ data: Application }> {
  return apiFetch<{ data: Application }>('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateApplication(
  id: number,
  data: UpdateApplicationInput,
): Promise<{ data: Application }> {
  return apiFetch<{ data: Application }>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteApplication(id: number): Promise<{ success: true }> {
  return apiFetch<{ success: true }>(`/applications/${id}`, {
    method: 'DELETE',
  });
}
