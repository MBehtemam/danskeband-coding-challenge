/**
 * Integration tests for Saved Views feature (011-saved-views)
 *
 * Tests the integration of saved views components into the incident table:
 * - SavedViewsDropdown integration (T036)
 * - SaveViewPanel integration (T038)
 * - View application workflow (T032, T039)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from '../../src/theme';
import { IncidentTable } from '../../src/components/incidents/IncidentTable';
import { SavedViewsProvider } from '../../src/contexts/SavedViewsContext';
import * as useIncidentsHook from '../../src/hooks/useIncidents';
import * as useUsersHook from '../../src/hooks/useUsers';
import type { Incident, User } from '../../src/api/types';

// Mock the hooks
vi.mock('../../src/hooks/useIncidents');
vi.mock('../../src/hooks/useUsers');

const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'Database connection timeout',
    description: 'Production database experiencing intermittent connection timeouts',
    status: 'In Progress',
    severity: 'High',
    assigneeId: 'user-1',
    createdAt: '2026-01-14T08:00:00Z',
    updatedAt: '2026-01-14T10:30:00Z',
    statusHistory: [
      { status: 'Open', changedAt: '2026-01-14T08:00:00Z', changedBy: 'user-1' },
      { status: 'In Progress', changedAt: '2026-01-14T09:15:00Z', changedBy: 'user-2' },
    ],
  },
  {
    id: 'INC-2024-002',
    title: 'API endpoint returning 500 errors',
    description: 'Users reporting 500 errors on /api/users endpoint',
    status: 'Open',
    severity: 'Critical',
    assigneeId: 'user-2',
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z',
    statusHistory: [
      { status: 'Open', changedAt: '2026-01-14T09:00:00Z', changedBy: 'user-2' },
    ],
  },
  {
    id: 'INC-2024-003',
    title: 'Login page not loading',
    description: 'Some users cannot access the login page',
    status: 'Resolved',
    severity: 'Medium',
    assigneeId: 'user-3',
    createdAt: '2026-01-14T07:00:00Z',
    updatedAt: '2026-01-14T11:00:00Z',
    statusHistory: [
      { status: 'Open', changedAt: '2026-01-14T07:00:00Z', changedBy: 'user-3' },
      { status: 'Resolved', changedAt: '2026-01-14T11:00:00Z', changedBy: 'user-3' },
    ],
  },
];

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@test.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@test.com' },
  { id: 'user-3', name: 'Charlie Davis', email: 'charlie@test.com' },
];

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SavedViewsProvider>
              {ui}
            </SavedViewsProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('Saved Views Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.resetAllMocks();

    // Mock hook responses
    vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
      data: mockIncidents,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useIncidentsHook.useIncidents>);

    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useUsersHook.useUsers>);
  });

  describe('Component Integration (T036, T038)', () => {
    it('renders SavedViewsDropdown in the table toolbar', async () => {
      renderWithProviders(<IncidentTable />);

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      });

      // SavedViewsDropdown should be rendered showing "Default View"
      expect(screen.getByRole('button', { name: /default view/i })).toBeInTheDocument();
    });

    it('opens SaveViewPanel when "Create New View" is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncidentTable />);

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      });

      // SaveViewPanel should not be visible initially
      expect(screen.queryByText('Save View')).not.toBeInTheDocument();

      // Open the saved views dropdown
      const dropdownButton = screen.getByRole('button', { name: /default view/i });
      await user.click(dropdownButton);

      // Click "Create New View"
      await waitFor(() => {
        expect(screen.getByText('Create New View')).toBeInTheDocument();
      });

      const createNewMenuItem = screen.getByText('Create New View').closest('li');
      await user.click(createNewMenuItem!);

      // SaveViewPanel should open - check for unique heading
      await waitFor(() => {
        expect(screen.getByText('Save View')).toBeInTheDocument();
      });
    });

    it('closes SaveViewPanel when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncidentTable />);

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      });

      // Open save view panel
      const dropdownButton = screen.getByRole('button', { name: /default view/i });
      await user.click(dropdownButton);

      const createNewMenuItem = screen.getByText('Create New View').closest('li');
      await user.click(createNewMenuItem!);

      // Wait for panel
      await waitFor(() => {
        expect(screen.getByText('Save View')).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Panel should close - heading should disappear
      await waitFor(() => {
        expect(screen.queryByText('Save View')).not.toBeInTheDocument();
      });
    });
  });

  describe('Create-and-Apply Workflow (T032, T039)', () => {
    it('creates a saved view and can select it from dropdown', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncidentTable />);

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      });

      // Open dropdown and create new view
      const dropdownButton = screen.getByRole('button', { name: /default view/i });
      await user.click(dropdownButton);

      const createNewMenuItem = screen.getByText('Create New View').closest('li');
      await user.click(createNewMenuItem!);

      // Wait for panel and enter name
      await waitFor(() => {
        expect(screen.getByText('Save View')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/view name/i);
      await user.type(nameInput, 'Test View');

      // Save the view
      const saveButton = screen.getByRole('button', { name: /^save$/i });
      await user.click(saveButton);

      // Panel should close
      await waitFor(() => {
        expect(screen.queryByText('Save View')).not.toBeInTheDocument();
      });

      // Open dropdown again - saved view should appear
      const newDropdownButton = screen.getByRole('button', { name: /default view/i });
      await user.click(newDropdownButton);

      await waitFor(() => {
        expect(screen.getByText('Test View')).toBeInTheDocument();
      });
    });

    it('applies a saved view by selecting it from dropdown', async () => {
      const user = userEvent.setup();

      // Pre-create a saved view with a filter
      localStorage.setItem(
        'saved-views',
        JSON.stringify([
          {
            id: 'view-1',
            name: 'In Progress Only',
            config: {
              columnVisibility: {},
              columnFilters: [{ id: 'status', value: 'In Progress' }],
              columnFilterFns: { status: 'equals' },
              sorting: [{ id: 'createdAt', desc: true }],
              globalFilter: '',
            },
            createdAt: '2026-01-14T10:00:00Z',
            updatedAt: '2026-01-14T10:00:00Z',
          },
        ])
      );

      renderWithProviders(<IncidentTable />);

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      });

      // Open dropdown and select the saved view
      const dropdownButton = screen.getByRole('button', { name: /default view/i });
      await user.click(dropdownButton);

      await waitFor(() => {
        expect(screen.getByText('In Progress Only')).toBeInTheDocument();
      });

      const savedViewMenuItem = screen.getByText('In Progress Only').closest('li');
      await user.click(savedViewMenuItem!);

      // Dropdown button should now show the active view name
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /in progress only/i })).toBeInTheDocument();
      });
    });

    it('switches back to default view when selected', async () => {
      const user = userEvent.setup();

      // Pre-create a saved view
      localStorage.setItem(
        'saved-views',
        JSON.stringify([
          {
            id: 'view-1',
            name: 'My View',
            config: {
              columnVisibility: {},
              columnFilters: [],
              columnFilterFns: {},
              sorting: [{ id: 'title', desc: false }],
              globalFilter: '',
            },
            createdAt: '2026-01-14T10:00:00Z',
            updatedAt: '2026-01-14T10:00:00Z',
          },
        ])
      );

      // Set it as active
      localStorage.setItem('active-view-id', JSON.stringify('view-1'));

      renderWithProviders(<IncidentTable />);

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      });

      // Should show active view
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /my view/i })).toBeInTheDocument();
      });

      // Open dropdown and select default view
      const dropdownButton = screen.getByRole('button', { name: /my view/i });
      await user.click(dropdownButton);

      const defaultViewMenuItem = screen.getByText('Default View').closest('li');
      await user.click(defaultViewMenuItem!);

      // Should show default view now
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /default view/i })).toBeInTheDocument();
      });
    });
  });

  describe('Configuration Capture and Apply (T037)', () => {
    it('opens SaveViewPanel with current configuration preview', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncidentTable />);

      // Wait for table to load
      await waitFor(() => {
        expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      });

      // Open create view panel directly (configuration capture is tested via captureCurrentConfig)
      const dropdownButton = screen.getByRole('button', { name: /default view/i });
      await user.click(dropdownButton);

      const createNewMenuItem = screen.getByText('Create New View').closest('li');
      await user.click(createNewMenuItem!);

      // Panel should show preview section (validates that captureCurrentConfig is called)
      await waitFor(() => {
        expect(screen.getByText('Save View')).toBeInTheDocument();
        expect(screen.getByText('Preview')).toBeInTheDocument();
      });
    });
  });
});
