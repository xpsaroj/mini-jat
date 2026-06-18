'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApplications, type GetApplicationsParams } from '@/lib/api';
import type { Application, PaginatedResponse } from '@/types';

export function useApplications(params: GetApplicationsParams = {}) {
  const { status, search, page = 1, limit = 10 } = params;

  const [data, setData] = useState<PaginatedResponse<Application> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getApplications({ status, search, page, limit });
      setData(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to fetch applications.',
      );
    } finally {
      setLoading(false);
    }
  }, [status, search, page, limit]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
