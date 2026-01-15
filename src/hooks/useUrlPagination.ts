import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { MRT_PaginationState } from 'material-react-table';
import {
  VALID_PAGE_SIZES,
  DEFAULT_PAGINATION,
  URL_PARAMS,
  type ValidPageSize,
} from '../types/filters';

/**
 * Hook for synchronizing pagination state with URL parameters.
 *
 * URL format:
 * - page: 1-based page number (maps to 0-based pageIndex internally)
 * - pageSize: rows per page (10, 20, 50, or 100)
 *
 * Features:
 * - Validates page numbers and clamps to valid range
 * - Validates pageSize and falls back to default if invalid
 * - Always keeps page and pageSize in URL (even for defaults)
 */
export function useUrlPagination(totalRows: number = 0) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize pagination from URL
  const [pagination, setPagination] = useState<MRT_PaginationState>(() => {
    const pageParam = searchParams.get(URL_PARAMS.PAGE);
    const pageSizeParam = searchParams.get(URL_PARAMS.PAGE_SIZE);

    // Parse pageSize with validation
    let pageSize = DEFAULT_PAGINATION.pageSize;
    if (pageSizeParam) {
      const parsed = parseInt(pageSizeParam, 10);
      if (!isNaN(parsed) && VALID_PAGE_SIZES.includes(parsed as ValidPageSize)) {
        pageSize = parsed;
      }
    }

    // Parse page with validation (URL uses 1-based, state uses 0-based)
    let pageIndex = DEFAULT_PAGINATION.pageIndex;
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        pageIndex = parsed - 1; // Convert to 0-based
      }
    }

    return { pageIndex, pageSize };
  });

  // Sync pagination to URL
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        // Always set page (1-based)
        params.set(URL_PARAMS.PAGE, String(pagination.pageIndex + 1));
        // Always set pageSize
        params.set(URL_PARAMS.PAGE_SIZE, String(pagination.pageSize));
        return params;
      },
      { replace: true }
    );
  }, [pagination, setSearchParams]);

  // Validate and clamp page index when data changes
  useEffect(() => {
    if (totalRows > 0) {
      const totalPages = Math.ceil(totalRows / pagination.pageSize);
      const maxPageIndex = Math.max(0, totalPages - 1);

      if (pagination.pageIndex > maxPageIndex) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: maxPageIndex,
        }));
      }
    }
  }, [totalRows, pagination.pageSize, pagination.pageIndex]);

  // Handler for MRT onPaginationChange
  const handlePaginationChange = useCallback(
    (
      updater:
        | MRT_PaginationState
        | ((old: MRT_PaginationState) => MRT_PaginationState)
    ) => {
      setPagination((prev) => {
        const newState = typeof updater === 'function' ? updater(prev) : updater;

        // Validate pageSize
        if (!VALID_PAGE_SIZES.includes(newState.pageSize as ValidPageSize)) {
          newState.pageSize = DEFAULT_PAGINATION.pageSize;
        }

        // Ensure pageIndex is not negative
        if (newState.pageIndex < 0) {
          newState.pageIndex = 0;
        }

        return newState;
      });
    },
    []
  );

  return {
    pagination,
    onPaginationChange: handlePaginationChange,
  };
}
