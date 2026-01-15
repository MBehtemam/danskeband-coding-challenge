import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IncidentDetailPanel } from './IncidentDetailPanel';
import * as useUsersHook from '../../hooks/useUsers';
import * as useIncidentsHook from '../../hooks/useIncidents';
import type { Incident, User } from '../../api/types';

vi.mock('../../hooks/useUsers');
vi.mock('../../hooks/useIncidents');

const mockIncident: Incident = {
  id: 'inc-1',
  title: 'Database connection timeout',
  description: 'The main database is experiencing intermittent connection timeouts during peak hours.',
  status: 'Open',
  severity: 'High',
  assigneeId: 'user-1',
  createdAt: '2026-01-14T10:00:00Z',
  updatedAt: '2026-01-14T12:30:00Z',
  statusHistory: [
    { status: 'Open', changedAt: '2026-01-14T10:00:00Z', changedBy: 'user-2' },
  ],
  isDummy: false,
};

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com' },
];

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe('IncidentDetailPanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useUsersHook.useUsers>);
    vi.mocked(useIncidentsHook.useUpdateIncident).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useIncidentsHook.useUpdateIncident>);
  });

  it('displays incident title', () => {
    renderWithProviders(<IncidentDetailPanel incident={mockIncident} />);

    expect(screen.getByRole('heading', { name: 'Database connection timeout' })).toBeInTheDocument();
  });

  it('displays incident description', () => {
    renderWithProviders(<IncidentDetailPanel incident={mockIncident} />);

    expect(
      screen.getByText(/The main database is experiencing intermittent/),
    ).toBeInTheDocument();
  });

  it('displays status and assignee labels', () => {
    renderWithProviders(<IncidentDetailPanel incident={mockIncident} />);

    // Status and Assignee appear as both labels and in select components
    expect(screen.getAllByText('Status').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Assignee').length).toBeGreaterThanOrEqual(1);
  });

  it('displays severity chip', () => {
    renderWithProviders(<IncidentDetailPanel incident={mockIncident} />);

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('displays created date', () => {
    renderWithProviders(<IncidentDetailPanel incident={mockIncident} />);

    expect(screen.getAllByText(/Jan 14, 2026/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays updated date', () => {
    renderWithProviders(<IncidentDetailPanel incident={mockIncident} />);

    expect(screen.getByText(/Last Updated/)).toBeInTheDocument();
    expect(screen.getAllByText(/Jan 14, 2026/).length).toBeGreaterThanOrEqual(2);
  });

  it('displays status history section', () => {
    renderWithProviders(<IncidentDetailPanel incident={mockIncident} />);

    expect(screen.getByText('Status History')).toBeInTheDocument();
  });
});
