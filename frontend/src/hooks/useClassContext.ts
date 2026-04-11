import { useCallback, useEffect, useRef, useState } from 'react';
import { ClassConfig, fetchClassConfig } from '../lib/classConfig';

interface UseClassContextResult {
  config: ClassConfig;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasConfig: boolean;
}

/**
 * Fetches the stored class-level configuration for a given class (and
 * optionally grade level). Generators use this to auto-fill repetitive
 * fields like subject, strand, learning styles, special needs, etc.
 *
 * Returns an empty config object when no class is selected or when no
 * config has been stored yet.
 */
export function useClassContext(
  className: string | undefined,
  gradeLevel?: string
): UseClassContextResult {
  const [config, setConfig] = useState<ClassConfig>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const load = useCallback(async () => {
    if (!className) {
      setConfig({});
      return;
    }
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const cfg = await fetchClassConfig(className, gradeLevel);
      if (id === reqId.current) setConfig(cfg || {});
    } catch (e: any) {
      if (id === reqId.current) setError(e?.message || 'Failed to load class config');
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [className, gradeLevel]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    config,
    loading,
    error,
    refresh: load,
    hasConfig: Object.keys(config || {}).length > 0,
  };
}
