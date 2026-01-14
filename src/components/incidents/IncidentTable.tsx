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
} from 'material-react-table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useIncidents } from '../../hooks/useIncidents';
import { useUsers } from '../../hooks/useUsers';
import { StatusChip } from '../common/StatusChip';
import { SeverityChip } from '../common/SeverityChip';
import { EmptyState } from '../common/EmptyState';
import { LoadingState } from '../common/LoadingState';
import { NoFilterResults } from '../common/NoFilterResults';
import { IncidentDrawer } from './IncidentDrawer';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { Incident, User } from '../../api/types';

export function IncidentTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { incidentId } = useParams<{ incidentId?: string }>();
  const navigate = useNavigate();
  const { data: incidents, isLoading: incidentsLoading } = useIncidents();
  const { data: users } = useUsers();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Initialize state from URL params
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(() => {
    const filters: MRT_ColumnFiltersState = [];
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const assignee = searchParams.get('assignee');

    if (status) filters.push({ id: 'status', value: status });
    if (severity) filters.push({ id: 'severity', value: severity });
    if (assignee) filters.push({ id: 'assigneeId', value: assignee });

    return filters;
  });

  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    return searchParams.get('search') ?? '';
  });

  const [sorting, setSorting] = useState<MRT_SortingState>(() => {
    const sortBy = searchParams.get('sortBy');
    const sortDesc = searchParams.get('sortDesc') === 'true';

    if (sortBy) {
      return [{ id: sortBy, desc: sortDesc }];
    }
    return [{ id: 'createdAt', desc: true }];
  });

  // Sync state to URL params (preserving filter state)
  useEffect(() => {
    const params = new URLSearchParams();

    // Add column filters to URL
    columnFilters.forEach((filter) => {
      if (filter.id === 'status' && filter.value) {
        params.set('status', filter.value as string);
      }
      if (filter.id === 'severity' && filter.value) {
        params.set('severity', filter.value as string);
      }
      if (filter.id === 'assigneeId' && filter.value) {
        params.set('assignee', filter.value as string);
      }
    });

    // Add global filter to URL
    if (globalFilter) {
      params.set('search', globalFilter);
    }

    // Add sorting to URL
    if (sorting.length > 0) {
      const sort = sorting[0];
      if (sort.id !== 'createdAt' || !sort.desc) {
        params.set('sortBy', sort.id);
        params.set('sortDesc', String(sort.desc));
      }
    }

    setSearchParams(params, { replace: true });
  }, [columnFilters, globalFilter, sorting, setSearchParams]);

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
    [userMap],
  );

  // Check if any filters are active
  const hasActiveFilters = columnFilters.length > 0 || globalFilter.length > 0;

  // Clear all filters
  const clearFilters = useCallback(() => {
    setColumnFilters([]);
    setGlobalFilter('');
  }, []);

  // Handle row click to open drawer - navigate to incident URL
  const handleRowClick = useCallback(
    (row: MRT_Row<Incident>) => {
      const rowId = row.original.id;
      // Navigate to incident URL, preserving filter params
      navigate(`/incidents/${rowId}${window.location.search}`, { replace: true });
    },
    [navigate],
  );

  // Handle drawer close - navigate back to base URL
  const handleDrawerClose = useCallback(() => {
    // Navigate to base URL, preserving filter params
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
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        Cell: ({ cell }) => <StatusChip status={cell.getValue<Incident['status']>()} />,
        filterVariant: 'select',
        filterSelectOptions: ['Open', 'In Progress', 'Resolved'],
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        size: 120,
        Cell: ({ cell }) => (
          <SeverityChip severity={cell.getValue<Incident['severity']>()} />
        ),
        filterVariant: 'select',
        filterSelectOptions: ['Critical', 'High', 'Medium', 'Low'],
        sortingFn: (rowA, rowB) => {
          const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          const a = severityOrder[rowA.original.severity];
          const b = severityOrder[rowB.original.severity];
          return a - b;
        },
      },
      {
        accessorKey: 'assigneeId',
        header: 'Assignee',
        size: 150,
        Cell: ({ cell }) => getUserName(cell.getValue<string | null>()),
        filterVariant: 'select',
        filterSelectOptions: users?.map((u) => u.name) ?? [],
        filterFn: (row, _columnId, filterValue) => {
          const assigneeName = getUserName(row.original.assigneeId);
          return assigneeName === filterValue;
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        size: 130,
        Cell: ({ cell }) => formatRelativeTime(cell.getValue<string>()),
        sortingFn: 'datetime',
      },
    ],
    [getUserName, users],
  );

  // Responsive column visibility - hide less important columns on smaller screens
  const columnVisibility = useMemo(() => {
    const visibility: Record<string, boolean> = {};
    if (isMobile) {
      // On mobile: only show title and status
      visibility.severity = false;
      visibility.assigneeId = false;
      visibility.createdAt = false;
    } else if (isTablet) {
      // On tablet: hide createdAt
      visibility.createdAt = false;
    }
    return visibility;
  }, [isMobile, isTablet]);

  // Responsive density
  const density: MRT_DensityState = isMobile ? 'compact' : 'comfortable';

  const table = useMaterialReactTable({
    columns,
    data: incidents ?? [],
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    enableExpanding: false, // Disabled - using drawer instead
    manualFiltering: false,
    manualSorting: false,
    getRowId: (row) => row.id,
    state: {
      isLoading: incidentsLoading,
      columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
      density,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
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
    renderTopToolbarCustomActions: () =>
      hasActiveFilters ? (
        <Button
          variant="text"
          startIcon={<FilterListOffIcon />}
          onClick={clearFilters}
          size="small"
        >
          Clear Filters
        </Button>
      ) : null,
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
        // Highlight selected row
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
      {/* Table container - adjusts width when drawer is open */}
      <Box
        sx={{
          flex: 1,
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1)',
          marginRight: selectedIncident ? { xs: 0, sm: '400px', md: '33%' } : 0,
        }}
      >
        <MaterialReactTable table={table} />
      </Box>

      {/* Incident Detail Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        onClose={handleDrawerClose}
        users={users ?? []}
      />
    </Box>
  );
}
