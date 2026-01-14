import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusHistoryTimeline } from './StatusHistoryTimeline';
import * as useUsersHook from '../../hooks/useUsers';
import type { StatusHistoryEntry, User } from '../../api/types';

vi.mock('../../hooks/useUsers');

const mockStatusHistory: StatusHistoryEntry[] = [
  { status: 'Open', changedAt: '2026-01-14T10:00:00Z', changedBy: 'user-1' },
  { status: 'In Progress', changedAt: '2026-01-14T11:30:00Z', changedBy: 'user-2' },
];

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

describe('StatusHistoryTimeline', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useUsersHook.useUsers>);
  });

  it('renders status history entries', () => {
    renderWithProviders(<StatusHistoryTimeline history={mockStatusHistory} />);

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('displays user names for each entry', () => {
    renderWithProviders(<StatusHistoryTimeline history={mockStatusHistory} />);

    expect(screen.getByText(/Alice Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Bob Smith/)).toBeInTheDocument();
  });

  it('displays formatted dates', () => {
    renderWithProviders(<StatusHistoryTimeline history={mockStatusHistory} />);

    // Multiple dates exist, just check at least one
    expect(screen.getAllByText(/Jan 14, 2026/).length).toBeGreaterThanOrEqual(1);
  });

  it('handles empty history', () => {
    renderWithProviders(<StatusHistoryTimeline history={[]} />);

    expect(screen.getByText(/no status history/i)).toBeInTheDocument();
  });

  it('handles unknown user', () => {
    const historyWithUnknown: StatusHistoryEntry[] = [
      { status: 'Open', changedAt: '2026-01-14T10:00:00Z', changedBy: 'unknown-user' },
    ];
    renderWithProviders(<StatusHistoryTimeline history={historyWithUnknown} />);

    expect(screen.getByText(/Unknown/)).toBeInTheDocument();
  });
});
