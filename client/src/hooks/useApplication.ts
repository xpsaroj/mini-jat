'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApplication } from '@/lib/api';
import type { Application } from '@/types';

export function useApplication(id: number | null) {
  const [data, setData] = useState<Application | null>(null);
  const [loading, setLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (id === null) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getApplication(id);
      setData(result.data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to fetch application.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
