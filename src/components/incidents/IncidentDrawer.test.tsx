import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IncidentDrawer } from './IncidentDrawer';
import type { Incident, User } from '../../api/types';

const mockIncident: Incident = {
  id: 'inc-1',
  title: 'Test Incident',
  description: 'Test description for the incident',
  status: 'Open',
  severity: 'High',
  assigneeId: 'user-1',
  createdAt: '2026-01-14T10:00:00Z',
  updatedAt: '2026-01-14T12:00:00Z',
  statusHistory: [
    { status: 'Open', changedAt: '2026-01-14T10:00:00Z', changedBy: 'user-1' },
  ],
  isDummy: false,
};

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@test.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@test.com' },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('IncidentDrawer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders when incident is provided', () => {
    render(
      <IncidentDrawer incident={mockIncident} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when incident is null', () => {
    render(
      <IncidentDrawer incident={null} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows incident title', () => {
    render(
      <IncidentDrawer incident={mockIncident} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Incident')).toBeInTheDocument();
  });

  it('shows incident description', () => {
    render(
      <IncidentDrawer incident={mockIncident} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test description for the incident')).toBeInTheDocument();
  });

  it('calls onClose when close drawer button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <IncidentDrawer incident={mockIncident} onClose={onClose} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    // Use more specific selector for the drawer close button (not the form's close panel button)
    const closeButton = screen.getByRole('button', { name: /close drawer/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has close button with accessible aria-label', () => {
    render(
      <IncidentDrawer incident={mockIncident} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    const closeButton = screen.getByRole('button', { name: /close drawer/i });
    expect(closeButton).toHaveAccessibleName();
  });

  it('updates when incident prop changes', () => {
    const { rerender } = render(
      <IncidentDrawer incident={mockIncident} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Incident')).toBeInTheDocument();

    const updatedIncident = {
      ...mockIncident,
      id: 'inc-2',
      title: 'Updated Incident',
    };

    rerender(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <IncidentDrawer incident={updatedIncident} onClose={vi.fn()} users={mockUsers} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Updated Incident')).toBeInTheDocument();
  });

  it('shows severity information', () => {
    render(
      <IncidentDrawer incident={mockIncident} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows status information', () => {
    render(
      <IncidentDrawer incident={mockIncident} onClose={vi.fn()} users={mockUsers} />,
      { wrapper: createWrapper() }
    );

    // Status should appear in the form - check for the status select (combobox)
    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    expect(statusSelect).toBeInTheDocument();
  });
});
