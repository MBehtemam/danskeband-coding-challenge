import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useIncidents, useCreateIncident, useUpdateIncident } from './useIncidents';
import * as incidentService from '../services/incidentService';
import type { Incident } from '../api/types';

vi.mock('../services/incidentService');

const mockIncident: Incident = {
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
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useIncidents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch incidents successfully', async () => {
    const mockIncidents = [mockIncident];
    vi.mocked(incidentService.fetchIncidents).mockResolvedValue(mockIncidents);

    const { result } = renderHook(() => useIncidents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockIncidents);
    expect(incidentService.fetchIncidents).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    vi.mocked(incidentService.fetchIncidents).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    const { result } = renderHook(() => useIncidents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useCreateIncident', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create incident successfully', async () => {
    const newIncident = { ...mockIncident, id: 'inc-new' };
    vi.mocked(incidentService.createIncident).mockResolvedValue(newIncident);

    const { result } = renderHook(() => useCreateIncident(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: 'New Incident',
      description: 'Description',
      severity: 'High',
      assigneeId: null,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(incidentService.createIncident).toHaveBeenCalledWith({
      title: 'New Incident',
      description: 'Description',
      severity: 'High',
      assigneeId: null,
    });
  });
});

describe('useUpdateIncident', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should update incident successfully', async () => {
    const updatedIncident = { ...mockIncident, status: 'In Progress' as const };
    vi.mocked(incidentService.updateIncident).mockResolvedValue(updatedIncident);

    const { result } = renderHook(() => useUpdateIncident(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 'inc-1',
      data: { status: 'In Progress' },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(incidentService.updateIncident).toHaveBeenCalledWith('inc-1', {
      status: 'In Progress',
    });
  });
});
