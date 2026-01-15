import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { lightTheme } from '../../theme';
import { ThemeContextProvider } from '../../contexts/ThemeContext';
import { DashboardPage } from './DashboardPage';
import * as useIncidentsHook from '../../hooks/useIncidents';
import * as useUsersHook from '../../hooks/useUsers';
import type { Incident, User } from '../../api/types';

vi.mock('../../hooks/useIncidents');
vi.mock('../../hooks/useUsers');

const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Test Incident',
    description: 'Test description',
    status: 'Open',
    severity: 'High',
    assigneeId: 'user-1',
    createdAt: '2026-01-14T10:00:00Z',
    updatedAt: '2026-01-14T10:00:00Z',
    statusHistory: [
      { status: 'Open', changedAt: '2026-01-14T10:00:00Z', changedBy: 'user-1' },
    ],
    isDummy: false,
  },
];

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
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
        <ThemeContextProvider>
          <ThemeProvider theme={lightTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {ui}
            </LocalizationProvider>
          </ThemeProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useIncidentsHook.useCreateIncident).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useIncidentsHook.useCreateIncident>);
  });

  it('renders the page with AppLayout', () => {
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

    renderWithProviders(<DashboardPage />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Incident Dashboard')).toBeInTheDocument();
  });

  it('renders the incident table', () => {
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

    renderWithProviders(<DashboardPage />);

    expect(screen.getByText('Test Incident')).toBeInTheDocument();
  });

  it('renders main content area', () => {
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

    renderWithProviders(<DashboardPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
