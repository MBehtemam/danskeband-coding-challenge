/**
 * Filter type definitions for Developer Settings & Table Enhancements feature
 */

/**
 * Date filter comparison operators
 */
export type DateFilterOperator = 'gt' | 'lt' | 'between';

/**
 * Represents the state of a date range filter with comparison operators.
 */
export interface DateFilterState {
  /** Selected comparison operator */
  operator: DateFilterOperator | null;
  /** ISO date string for primary date */
  startDate: string | null;
  /** ISO date string for 'between' end date */
  endDate: string | null;
}

/**
 * Represents pagination state synchronized with URL parameters.
 */
export interface PaginationState {
  /** 0-based page index (URL shows 1-based) */
  pageIndex: number;
  /** Rows per page (10, 20, 50, or 100) */
  pageSize: number;
}

/**
 * Represents which columns are visible in the table.
 */
export type ColumnVisibilityState = Record<string, boolean>;

/**
 * Column IDs for the incident table
 */
export type IncidentColumnId =
  | 'title'
  | 'status'
  | 'severity'
  | 'assigneeId'
  | 'createdAt';

/**
 * Valid page size options for pagination
 */
export const VALID_PAGE_SIZES = [10, 20, 50, 100] as const;
export type ValidPageSize = (typeof VALID_PAGE_SIZES)[number];

/**
 * URL parameter names for table state
 *
 * Filter naming convention uses bracket notation for nested filters:
 * - filter[field][property]: e.g., filter[created][from], filter[created][to]
 *
 * This is the industry standard (used by Rails, PHP, qs library) and:
 * - Avoids conflicts with column names (filters are always under "filter" namespace)
 * - Supports multiple filter types on the same field
 * - Is easily extensible for new date fields (e.g., filter[updated][from])
 *
 * @see https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/
 */
export const URL_PARAMS = {
  PAGE: 'page',
  PAGE_SIZE: 'pageSize',
  // Simple filters use filter[field] format
  STATUS: 'filter[status]',
  STATUS_MODE: 'filter[status][mode]',
  SEVERITY: 'filter[severity]',
  SEVERITY_MODE: 'filter[severity][mode]',
  ASSIGNEE: 'filter[assignee]',
  ASSIGNEE_MODE: 'filter[assignee][mode]',
  SEARCH: 'search',
  // Date filters use filter[field][from/to/op] format
  CREATED_FROM: 'filter[created][from]',
  CREATED_TO: 'filter[created][to]',
  CREATED_OP: 'filter[created][op]',
  SORT_BY: 'sortBy',
  SORT_DESC: 'sortDesc',
  HIDDEN_COLUMNS: 'hiddenColumns',
} as const;

/**
 * MRT filter function names to URL-friendly short codes
 */
export const FILTER_MODE_URL_MAP: Record<string, string> = {
  equals: 'eq',
  notEquals: 'neq',
  contains: 'contains',
  startsWith: 'starts',
  endsWith: 'ends',
  fuzzy: 'fuzzy',
  betweenInclusive: 'between',
  greaterThan: 'gt',
  lessThan: 'lt',
};

/**
 * URL-friendly short codes to MRT filter function names
 */
export const URL_FILTER_MODE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(FILTER_MODE_URL_MAP).map(([k, v]) => [v, k])
);

/**
 * Default pagination values
 */
export const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};
