import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from '../../theme';
import { IncidentTable } from './IncidentTable';
import { SavedViewsProvider } from '../../contexts/SavedViewsContext';
import * as useIncidentsHook from '../../hooks/useIncidents';
import * as useUsersHook from '../../hooks/useUsers';
import type { Incident, User } from '../../api/types';

vi.mock('../../hooks/useIncidents');
vi.mock('../../hooks/useUsers');

const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Database connection timeout',
    description: 'The main database is experiencing intermittent connection timeouts.',
    status: 'Open',
    severity: 'High',
    assigneeId: 'user-1',
    createdAt: '2026-01-14T10:00:00Z',
    updatedAt: '2026-01-14T10:00:00Z',
    statusHistory: [
      { status: 'Open', changedAt: '2026-01-14T10:00:00Z', changedBy: 'user-2' },
    ],
    isDummy: false,
  },
  {
    id: 'inc-2',
    title: 'Payment gateway error',
    description: 'Payment processing is failing for some transactions.',
    status: 'In Progress',
    severity: 'Critical',
    assigneeId: 'user-2',
    createdAt: '2026-01-13T09:00:00Z',
    updatedAt: '2026-01-13T11:00:00Z',
    statusHistory: [
      { status: 'Open', changedAt: '2026-01-13T09:00:00Z', changedBy: 'user-1' },
      { status: 'In Progress', changedAt: '2026-01-13T11:00:00Z', changedBy: 'user-2' },
    ],
    isDummy: false,
  },
  {
    id: 'inc-3',
    title: 'CSS broken on mobile',
    description: 'Login page CSS is broken on mobile devices.',
    status: 'Resolved',
    severity: 'Medium',
    assigneeId: null,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T16:00:00Z',
    statusHistory: [
      { status: 'Open', changedAt: '2026-01-12T08:00:00Z', changedBy: 'user-3' },
      { status: 'Resolved', changedAt: '2026-01-12T16:00:00Z', changedBy: 'user-3' },
    ],
    isDummy: false,
  },
];

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: 'user-3', name: 'Carol Williams', email: 'carol@example.com' },
];

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
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

describe('IncidentTable', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('rendering incidents', () => {
    it('renders incident titles in the table', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: mockIncidents,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      expect(screen.getByText('Database connection timeout')).toBeInTheDocument();
      expect(screen.getByText('Payment gateway error')).toBeInTheDocument();
      expect(screen.getByText('CSS broken on mobile')).toBeInTheDocument();
    });

    it('renders status chips for each incident', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: mockIncidents,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    it('renders severity chips for each incident', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: mockIncidents,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('renders assignee names from user lookup', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: mockIncidents,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    it('renders "Unassigned" for incidents with no assignee', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: mockIncidents,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });
  });

  describe('table columns', () => {
    it('renders all expected column headers', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: mockIncidents,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Severity')).toBeInTheDocument();
      expect(screen.getByText('Assignee')).toBeInTheDocument();
      expect(screen.getByText('Created')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading indicator when incidents are loading', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows empty state when no incidents exist', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      // Look for the heading specifically
      expect(screen.getByRole('heading', { name: /no incidents found/i })).toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    it('renders pagination controls', () => {
      vi.mocked(useIncidentsHook.useIncidents).mockReturnValue({
        data: mockIncidents,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useIncidentsHook.useIncidents>);
      vi.mocked(useUsersHook.useUsers).mockReturnValue({
        data: mockUsers,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useUsersHook.useUsers>);

      renderWithProviders(<IncidentTable />);

      // MRT renders pagination, look for rows per page
      expect(screen.getByRole('combobox', { name: /rows per page/i })).toBeInTheDocument();
    });
  });
});
