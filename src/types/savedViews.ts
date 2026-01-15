import type {
  MRT_ColumnFiltersState,
  MRT_ColumnFilterFnsState,
  MRT_SortingState,
  MRT_VisibilityState
} from 'material-react-table';

/**
 * Table configuration that can be saved as a view
 */
export interface ViewConfig {
  columnVisibility: MRT_VisibilityState;
  columnFilters: MRT_ColumnFiltersState;
  columnFilterFns: MRT_ColumnFilterFnsState;
  sorting: MRT_SortingState;
  globalFilter: string;
}

/**
 * A user-created saved view with metadata
 */
export interface SavedView {
  id: string;
  name: string;
  config: ViewConfig;
  createdAt: string;
  updatedAt: string;
}

/**
 * Storage availability status
 */
export type StorageStatus = 'full' | 'session' | 'none';

/**
 * Context state for saved views management
 */
export interface SavedViewsState {
  savedViews: SavedView[];
  activeViewId: string | null;
  storageAvailable: StorageStatus;
  isDirty: boolean;
}

/**
 * Context value provided to consumers
 */
export interface SavedViewsContextValue extends SavedViewsState {
  createView: (name: string, config: ViewConfig) => SavedView | null;
  updateView: (viewId: string, config: ViewConfig) => boolean;
  renameView: (viewId: string, newName: string) => boolean;
  deleteView: (viewId: string) => boolean;
  applyView: (viewId: string | null) => ViewConfig | null;
  validateViewName: (name: string, excludeViewId?: string) => ValidationResult;
}

/**
 * Validation result for view name
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Constants
 */
export const STORAGE_KEY_SAVED_VIEWS = 'saved-views';
export const STORAGE_KEY_ACTIVE_VIEW_ID = 'active-view-id';
export const MAX_SAVED_VIEWS = 50;
export const MIN_VIEW_NAME_LENGTH = 1;
export const MAX_VIEW_NAME_LENGTH = 100;

/**
 * Default view configuration (system-provided)
 */
export const DEFAULT_VIEW_CONFIG: ViewConfig = {
  columnVisibility: {},
  columnFilters: [],
  columnFilterFns: {},
  sorting: [{ id: 'createdAt', desc: true }],
  globalFilter: '',
};
