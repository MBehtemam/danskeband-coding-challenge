import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Generic hook for synchronizing state with URL search parameters.
 * Provides get, set, and remove operations for URL parameters.
 */
export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Get a string value from URL params
   */
  const getString = useCallback(
    (key: string, defaultValue: string = ''): string => {
      return searchParams.get(key) ?? defaultValue;
    },
    [searchParams]
  );

  /**
   * Get a number value from URL params with validation
   */
  const getNumber = useCallback(
    (key: string, defaultValue: number, validValues?: readonly number[]): number => {
      const value = searchParams.get(key);
      if (value === null) return defaultValue;

      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) return defaultValue;

      if (validValues && !validValues.includes(parsed)) {
        return defaultValue;
      }

      return parsed;
    },
    [searchParams]
  );

  /**
   * Get a boolean value from URL params
   */
  const getBoolean = useCallback(
    (key: string, defaultValue: boolean = false): boolean => {
      const value = searchParams.get(key);
      if (value === null) return defaultValue;
      return value === 'true';
    },
    [searchParams]
  );

  /**
   * Get an array value from URL params (comma-separated)
   */
  const getArray = useCallback(
    (key: string): string[] => {
      const value = searchParams.get(key);
      if (!value) return [];
      return value.split(',').filter(Boolean);
    },
    [searchParams]
  );

  /**
   * Set a single URL parameter
   */
  const setParam = useCallback(
    (key: string, value: string | number | boolean | null) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (value === null || value === '') {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  /**
   * Set multiple URL parameters at once
   */
  const setParams = useCallback(
    (updates: Record<string, string | number | boolean | null>) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
              params.delete(key);
            } else {
              params.set(key, String(value));
            }
          });
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  /**
   * Set an array value as comma-separated string
   */
  const setArray = useCallback(
    (key: string, values: string[]) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (values.length === 0) {
            params.delete(key);
          } else {
            params.set(key, values.join(','));
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  /**
   * Remove a parameter from URL
   */
  const removeParam = useCallback(
    (key: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.delete(key);
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  /**
   * Remove multiple parameters from URL
   */
  const removeParams = useCallback(
    (keys: string[]) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          keys.forEach((key) => params.delete(key));
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return {
    searchParams,
    getString,
    getNumber,
    getBoolean,
    getArray,
    setParam,
    setParams,
    setArray,
    removeParam,
    removeParams,
  };
}
