import { useMemo, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_Row,
  type MRT_DensityState,
  type MRT_VisibilityState,
  type MRT_ColumnFilterFnsState,
} from 'material-react-table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Box from '@mui/material/Box';

// Enable UTC plugin for consistent date comparisons
dayjs.extend(utc);
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import AddIcon from '@mui/icons-material/Add';
import { useIncidents } from '../../hooks/useIncidents';
import { useUsers } from '../../hooks/useUsers';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { StatusChip } from '../common/StatusChip';
import { SeverityChip } from '../common/SeverityChip';
import { EmptyState } from '../common/EmptyState';
import { LoadingState } from '../common/LoadingState';
import { NoFilterResults } from '../common/NoFilterResults';
import { IncidentDrawer } from './IncidentDrawer';
import { formatRelativeTime } from '../../utils/dateUtils';
import { URL_PARAMS, FILTER_MODE_URL_MAP, URL_FILTER_MODE_MAP } from '../../types/filters';
import type { Incident, User, IncidentStatus, IncidentSeverity } from '../../api/types';
import { useSavedViews } from '../../contexts/SavedViewsContext';
import { SavedViewsDropdown } from './saved-views/SavedViewsDropdown';
import { SaveViewPanel } from './saved-views/SaveViewPanel';
import DeleteViewDialog from './saved-views/DeleteViewDialog';
import type { ViewConfig, SavedView } from '../../types/savedViews';

// Default filter modes for each column
const DEFAULT_FILTER_MODES: MRT_ColumnFilterFnsState = {
  title: 'contains',
  status: 'equals',
  severity: 'equals',
  assigneeId: 'equals',
  createdAt: 'betweenInclusive',
};

interface IncidentTableProps {
  onCreateClick?: () => void;
}

export function IncidentTable({ onCreateClick }: IncidentTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { incidentId } = useParams<{ incidentId?: string }>();
  const navigate = useNavigate();
  const { data: incidents, isLoading: incidentsLoading } = useIncidents();
  const { data: users } = useUsers();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Saved Views
  const { createView, applyView, updateView, renameView, deleteView, savedViews } = useSavedViews();
  const [saveViewPanelOpen, setSaveViewPanelOpen] = useState(false);
  const [saveViewPanelMode, setSaveViewPanelMode] = useState<'create' | 'rename'>('create');
  const [renameViewId, setRenameViewId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<SavedView | undefined>(undefined);

  // URL-synchronized pagination
  const { pagination, onPaginationChange } = useUrlPagination(incidents?.length ?? 0);

  // Initialize column filters from URL params
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(() => {
    const filters: MRT_ColumnFiltersState = [];
    const status = searchParams.get(URL_PARAMS.STATUS);
    const severity = searchParams.get(URL_PARAMS.SEVERITY);
    const assignee = searchParams.get(URL_PARAMS.ASSIGNEE);

    if (status) filters.push({ id: 'status', value: status });
    if (severity) filters.push({ id: 'severity', value: severity });
    if (assignee) filters.push({ id: 'assigneeId', value: assignee });

    // Add date filter if present (MRT date-range uses array [startDate, endDate])
    // Parse dates simply - dayjs will handle them in local timezone
    const createdFrom = searchParams.get(URL_PARAMS.CREATED_FROM);
    const createdTo = searchParams.get(URL_PARAMS.CREATED_TO);
    if (createdFrom || createdTo) {
      filters.push({
        id: 'createdAt',
        value: [
          createdFrom ? dayjs(createdFrom) : null,
          createdTo ? dayjs(createdTo) : null,
        ],
      });
    }

    return filters;
  });

  // Initialize column filter modes from URL
  const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(() => {
    const modes: MRT_ColumnFilterFnsState = { ...DEFAULT_FILTER_MODES };

    // Load status filter mode from URL
    const statusMode = searchParams.get(URL_PARAMS.STATUS_MODE);
    if (statusMode && URL_FILTER_MODE_MAP[statusMode]) {
      modes.status = URL_FILTER_MODE_MAP[statusMode] as MRT_ColumnFilterFnsState[string];
    }

    // Load severity filter mode from URL
    const severityMode = searchParams.get(URL_PARAMS.SEVERITY_MODE);
    if (severityMode && URL_FILTER_MODE_MAP[severityMode]) {
      modes.severity = URL_FILTER_MODE_MAP[severityMode] as MRT_ColumnFilterFnsState[string];
    }

    // Load assignee filter mode from URL
    const assigneeMode = searchParams.get(URL_PARAMS.ASSIGNEE_MODE);
    if (assigneeMode && URL_FILTER_MODE_MAP[assigneeMode]) {
      modes.assigneeId = URL_FILTER_MODE_MAP[assigneeMode] as MRT_ColumnFilterFnsState[string];
    }

    // Load date filter mode from URL
    const createdOp = searchParams.get(URL_PARAMS.CREATED_OP);
    if (createdOp && URL_FILTER_MODE_MAP[createdOp]) {
      modes.createdAt = URL_FILTER_MODE_MAP[createdOp] as MRT_ColumnFilterFnsState[string];
    }

    return modes;
  });

  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    return searchParams.get(URL_PARAMS.SEARCH) ?? '';
  });

  const [sorting, setSorting] = useState<MRT_SortingState>(() => {
    const sortBy = searchParams.get(URL_PARAMS.SORT_BY);
    const sortDesc = searchParams.get(URL_PARAMS.SORT_DESC) === 'true';

    if (sortBy) {
      return [{ id: sortBy, desc: sortDesc }];
    }
    return [{ id: 'createdAt', desc: true }];
  });

  // Initialize user-controlled column visibility from URL
  const [userColumnVisibility, setUserColumnVisibility] = useState<MRT_VisibilityState>(() => {
    const hiddenColumns = searchParams.get(URL_PARAMS.HIDDEN_COLUMNS);
    if (!hiddenColumns) return {};
    const hidden = hiddenColumns.split(',').filter(Boolean);
    return Object.fromEntries(hidden.map((col) => [col, false]));
  });

  // Responsive defaults for column visibility
  const responsiveDefaults = useMemo(() => {
    const defaults: MRT_VisibilityState = {};
    if (isMobile) {
      defaults.severity = false;
      defaults.assigneeId = false;
      defaults.createdAt = false;
    } else if (isTablet) {
      defaults.createdAt = false;
    }
    return defaults;
  }, [isMobile, isTablet]);

  // Merge responsive defaults with user preferences (user takes precedence)
  const columnVisibility = useMemo(() => {
    const merged = { ...responsiveDefaults };
    // User preferences override responsive defaults
    Object.entries(userColumnVisibility).forEach(([key, value]) => {
      merged[key] = value;
    });
    // Title column must always be visible
    merged.title = true;
    return merged;
  }, [responsiveDefaults, userColumnVisibility]);

  // Sync filters, sorting, and visibility to URL params
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);

        // Clear filter params first (keep pagination)
        params.delete(URL_PARAMS.STATUS);
        params.delete(URL_PARAMS.STATUS_MODE);
        params.delete(URL_PARAMS.SEVERITY);
        params.delete(URL_PARAMS.SEVERITY_MODE);
        params.delete(URL_PARAMS.ASSIGNEE);
        params.delete(URL_PARAMS.ASSIGNEE_MODE);
        params.delete(URL_PARAMS.SEARCH);
        params.delete(URL_PARAMS.CREATED_OP);
        params.delete(URL_PARAMS.CREATED_FROM);
        params.delete(URL_PARAMS.CREATED_TO);
        params.delete(URL_PARAMS.SORT_BY);
        params.delete(URL_PARAMS.SORT_DESC);
        params.delete(URL_PARAMS.HIDDEN_COLUMNS);

        // Add column filters and their modes to URL
        columnFilters.forEach((filter) => {
          if (filter.id === 'status' && filter.value) {
            params.set(URL_PARAMS.STATUS, filter.value as string);
            // Save filter mode if not default
            const mode = columnFilterFns.status;
            if (mode && mode !== DEFAULT_FILTER_MODES.status) {
              const urlMode = FILTER_MODE_URL_MAP[mode as string];
              if (urlMode) params.set(URL_PARAMS.STATUS_MODE, urlMode);
            }
          }
          if (filter.id === 'severity' && filter.value) {
            params.set(URL_PARAMS.SEVERITY, filter.value as string);
            // Save filter mode if not default
            const mode = columnFilterFns.severity;
            if (mode && mode !== DEFAULT_FILTER_MODES.severity) {
              const urlMode = FILTER_MODE_URL_MAP[mode as string];
              if (urlMode) params.set(URL_PARAMS.SEVERITY_MODE, urlMode);
            }
          }
          if (filter.id === 'assigneeId' && filter.value) {
            params.set(URL_PARAMS.ASSIGNEE, filter.value as string);
            // Save filter mode if not default
            const mode = columnFilterFns.assigneeId;
            if (mode && mode !== DEFAULT_FILTER_MODES.assigneeId) {
              const urlMode = FILTER_MODE_URL_MAP[mode as string];
              if (urlMode) params.set(URL_PARAMS.ASSIGNEE_MODE, urlMode);
            }
          }
          if (filter.id === 'createdAt' && filter.value) {
            const dateValue = filter.value as [Dayjs | null, Dayjs | null];
            // Only add date params to URL if at least one date is set
            const hasStart = dateValue[0] != null;
            const hasEnd = dateValue[1] != null;
            if (hasStart || hasEnd) {
              // Map MRT filter mode to URL param
              const filterMode = columnFilterFns.createdAt as string;
              const urlMode = FILTER_MODE_URL_MAP[filterMode];
              if (urlMode) {
                params.set(URL_PARAMS.CREATED_OP, urlMode);
              }
              if (hasStart) {
                params.set(URL_PARAMS.CREATED_FROM, dateValue[0]!.format('YYYY-MM-DD'));
              }
              if (hasEnd) {
                params.set(URL_PARAMS.CREATED_TO, dateValue[1]!.format('YYYY-MM-DD'));
              }
            }
          }
        });

        // Add global filter to URL
        if (globalFilter) {
          params.set(URL_PARAMS.SEARCH, globalFilter);
        }

        // Add sorting to URL (only if not default)
        if (sorting.length > 0) {
          const sort = sorting[0];
          if (sort.id !== 'createdAt' || !sort.desc) {
            params.set(URL_PARAMS.SORT_BY, sort.id);
            params.set(URL_PARAMS.SORT_DESC, String(sort.desc));
          }
        }

        // Add hidden columns to URL
        const hiddenCols = Object.entries(userColumnVisibility)
          .filter(([key, visible]) => visible === false && key !== 'title')
          .map(([key]) => key);
        if (hiddenCols.length > 0) {
          params.set(URL_PARAMS.HIDDEN_COLUMNS, hiddenCols.join(','));
        }

        return params;
      },
      { replace: true }
    );
  }, [columnFilters, columnFilterFns, globalFilter, sorting, userColumnVisibility, setSearchParams]);

  // Handle column visibility changes
  const handleColumnVisibilityChange = useCallback(
    (
      updater:
        | MRT_VisibilityState
        | ((old: MRT_VisibilityState) => MRT_VisibilityState)
    ) => {
      setUserColumnVisibility((prev) => {
        const newState = typeof updater === 'function' ? updater(prev) : updater;
        // Ensure title is always visible
        if (newState.title === false) {
          newState.title = true;
        }
        return newState;
      });
    },
    []
  );

  // Create a lookup map for user names
  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    users?.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  // Get user name by ID
  const getUserName = useCallback(
    (assigneeId: string | null): string => {
      if (!assigneeId) return 'Unassigned';
      const user = userMap.get(assigneeId);
      return user?.name ?? 'Unknown';
    },
    [userMap]
  );

  // Check if any filters are active
  const hasActiveFilters = columnFilters.length > 0 || globalFilter.length > 0;

  // Clear all filters
  const clearFilters = useCallback(() => {
    setColumnFilters([]);
    setGlobalFilter('');
  }, []);

  // Helper function to capture current table configuration
  const captureCurrentConfig = useCallback((): ViewConfig => {
    return {
      columnVisibility: userColumnVisibility,
      columnFilters,
      columnFilterFns,
      sorting,
      globalFilter,
    };
  }, [userColumnVisibility, columnFilters, columnFilterFns, sorting, globalFilter]);

  // Helper function to apply a view configuration to the table
  const applyConfigToTable = useCallback((config: ViewConfig) => {
    setUserColumnVisibility(config.columnVisibility);
    setColumnFilters(config.columnFilters);
    setColumnFilterFns(config.columnFilterFns);
    setSorting(config.sorting);
    setGlobalFilter(config.globalFilter);
  }, []);

  // Handle view selection from dropdown
  const handleViewSelect = useCallback(
    (viewId: string | null) => {
      const config = applyView(viewId);
      if (config) {
        applyConfigToTable(config);
      }
    },
    [applyView, applyConfigToTable]
  );

  // Handle create new view
  const handleCreateNewView = useCallback(() => {
    setSaveViewPanelOpen(true);
  }, []);

  // Handle save view
  const handleSaveView = useCallback(
    (name: string) => {
      const config = captureCurrentConfig();
      const newView = createView(name, config);
      if (newView) {
        setSaveViewPanelOpen(false);
      }
    },
    [captureCurrentConfig, createView]
  );

  // Handle close save view panel
  const handleCloseSaveViewPanel = useCallback(() => {
    setSaveViewPanelOpen(false);
    setSaveViewPanelMode('create');
    setRenameViewId(null);
  }, []);

  // Handle rename view
  const handleRenameView = useCallback((viewId: string) => {
    setRenameViewId(viewId);
    setSaveViewPanelMode('rename');
    setSaveViewPanelOpen(true);
  }, []);

  // Handle save rename
  const handleSaveRename = useCallback(
    (newName: string) => {
      if (renameViewId) {
        const success = renameView(renameViewId, newName);
        if (success) {
          setSaveViewPanelOpen(false);
          setSaveViewPanelMode('create');
          setRenameViewId(null);
        }
      }
    },
    [renameViewId, renameView]
  );

  // Handle update view
  const handleUpdateView = useCallback(
    (viewId: string) => {
      const config = captureCurrentConfig();
      updateView(viewId, config);
    },
    [captureCurrentConfig, updateView]
  );

  // Handle delete view
  const handleDeleteView = useCallback((viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId);
    if (view) {
      setViewToDelete(view);
      setDeleteDialogOpen(true);
    }
  }, [savedViews]);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(() => {
    if (viewToDelete) {
      const success = deleteView(viewToDelete.id);
      if (success) {
        setDeleteDialogOpen(false);
        setViewToDelete(undefined);
      }
    }
  }, [viewToDelete, deleteView]);

  // Handle close delete dialog
  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setViewToDelete(undefined);
  }, []);

  // Handle row click to open drawer - navigate to incident URL
  const handleRowClick = useCallback(
    (row: MRT_Row<Incident>) => {
      const rowId = row.original.id;
      navigate(`/incidents/${rowId}${window.location.search}`, { replace: true });
    },
    [navigate]
  );

  // Handle drawer close - navigate back to base URL
  const handleDrawerClose = useCallback(() => {
    navigate('/' + window.location.search, { replace: true });
  }, [navigate]);

  // Find the selected incident
  const selectedIncident = useMemo(() => {
    if (!incidentId || !incidents) return null;
    return incidents.find((inc) => inc.id === incidentId) ?? null;
  }, [incidentId, incidents]);

  const columns = useMemo<MRT_ColumnDef<Incident>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        size: 300,
        enableGlobalFilter: true,
        enableHiding: false, // Title cannot be hidden
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        Cell: ({ cell }) => <StatusChip status={cell.getValue<IncidentStatus>()} />,
        filterVariant: 'select',
        filterSelectOptions: ['Open', 'In Progress', 'Resolved'],
        enableColumnFilterModes: true,
        columnFilterModeOptions: ['equals', 'notEquals'],
        muiFilterSelectProps: {
          renderValue: (value: unknown) =>
            value ? <StatusChip status={value as IncidentStatus} size="small" /> : null,
        },
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        size: 120,
        Cell: ({ cell }) => <SeverityChip severity={cell.getValue<IncidentSeverity>()} />,
        filterVariant: 'select',
        filterSelectOptions: ['Critical', 'High', 'Medium', 'Low'],
        enableColumnFilterModes: true,
        columnFilterModeOptions: ['equals', 'notEquals'],
        muiFilterSelectProps: {
          renderValue: (value: unknown) =>
            value ? <SeverityChip severity={value as IncidentSeverity} size="small" /> : null,
        },
        sortingFn: (rowA, rowB) => {
          const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          const a = severityOrder[rowA.original.severity];
          const b = severityOrder[rowB.original.severity];
          return a - b;
        },
      },
      {
        id: 'assigneeId',
        accessorFn: (row) => getUserName(row.assigneeId),
        header: 'Assignee',
        size: 150,
        filterVariant: 'select',
        filterSelectOptions: ['Unassigned', ...(users?.map((u) => u.name) ?? [])],
        enableColumnFilterModes: true,
        columnFilterModeOptions: ['equals', 'notEquals'],
        filterFn: (row, _columnId, filterValue) => {
          if (filterValue === 'Unassigned') {
            return !row.original.assigneeId;
          }
          const assigneeName = getUserName(row.original.assigneeId);
          return assigneeName === filterValue;
        },
      },
      {
        id: 'createdAt',
        // Use accessorFn to convert ISO string to Date for proper date filtering
        accessorFn: (row) => new Date(row.createdAt),
        header: 'Created',
        size: 180,
        // Cell still displays using the original ISO string for relative time
        Cell: ({ row }) => formatRelativeTime(row.original.createdAt),
        sortingFn: 'datetime',
        filterVariant: 'date-range',
        enableColumnFilterModes: true,
        columnFilterModeOptions: ['betweenInclusive', 'greaterThan', 'lessThan'],
      },
    ],
    [getUserName, users]
  );

  // Responsive density
  const density: MRT_DensityState = isMobile ? 'compact' : 'comfortable';

  const table = useMaterialReactTable({
    columns,
    data: incidents ?? [],
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    enableHiding: true,
    enableExpanding: false,
    enableColumnFilterModes: true,
    manualFiltering: false,
    manualSorting: false,
    manualPagination: false,
    getRowId: (row) => row.id,
    state: {
      isLoading: incidentsLoading,
      columnFilters,
      columnFilterFns,
      globalFilter,
      sorting,
      columnVisibility,
      density,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnFilterFnsChange: setColumnFilterFns,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onPaginationChange,
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 50, 100],
    },
    renderEmptyRowsFallback: () =>
      hasActiveFilters ? (
        <NoFilterResults onClearFilters={clearFilters} />
      ) : (
        <EmptyState
          title="No incidents found"
          description="There are no incidents to display. Create a new incident to get started."
        />
      ),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
        {/* Create Incident button - moved to LEFT side */}
        {onCreateClick && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
            aria-label="Create new incident"
          >
            Create Incident
          </Button>
        )}

        {/* Spacer to push items to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Clear Filters button */}
        {hasActiveFilters && (
          <Button
            variant="text"
            startIcon={<FilterListOffIcon />}
            onClick={clearFilters}
            size="small"
          >
            Clear Filters
          </Button>
        )}

        {/* Saved Views dropdown - moved to RIGHT side with text variant (no border) */}
        <SavedViewsDropdown
          onViewSelect={handleViewSelect}
          onCreateNew={handleCreateNewView}
          onRename={handleRenameView}
          onUpdate={handleUpdateView}
          onDelete={handleDeleteView}
        />
      </Box>
    ),
    muiCircularProgressProps: {
      color: 'primary',
    },
    muiTableContainerProps: {
      sx: { minHeight: '400px' },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        ...(incidentId === row.original.id && {
          backgroundColor: 'action.selected',
        }),
      },
      onClick: () => handleRowClick(row),
    }),
  });

  if (incidentsLoading) {
    return <LoadingState text="Loading incidents..." />;
  }

  return (
    <Box sx={{ width: '100%', display: 'flex' }}>
      <Box
        sx={{
          flex: 1,
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1)',
          marginRight: selectedIncident ? { xs: 0, sm: '400px', md: '33%' } : 0,
        }}
      >
        <MaterialReactTable table={table} />
      </Box>

      <IncidentDrawer
        incident={selectedIncident}
        onClose={handleDrawerClose}
        users={users ?? []}
      />

      <SaveViewPanel
        open={saveViewPanelOpen}
        onClose={handleCloseSaveViewPanel}
        onSave={saveViewPanelMode === 'rename' ? handleSaveRename : handleSaveView}
        currentConfig={captureCurrentConfig()}
        mode={saveViewPanelMode}
        initialName={renameViewId ? savedViews.find((v) => v.id === renameViewId)?.name : ''}
      />

      <DeleteViewDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        view={viewToDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
