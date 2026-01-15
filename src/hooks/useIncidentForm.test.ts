import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useIncidentForm } from './useIncidentForm';
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
  isDummy: false,
};

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
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useIncidentForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('initial state', () => {
    it('initializes formValues from incident', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      expect(result.current.formValues).toEqual({
        status: 'Open',
        severity: 'High',
        assigneeId: 'user-1',
      });
    });

    it('initializes severity from incident', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      expect(result.current.formValues.severity).toBe('High');
    });

    it('initializes hasChanges as false', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      expect(result.current.hasChanges).toBe(false);
    });

    it('initializes isSaving as false', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSaving).toBe(false);
    });

    it('initializes saveError as null', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      expect(result.current.saveError).toBeNull();
    });

    it('initializes saveSuccess as false', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      expect(result.current.saveSuccess).toBe(false);
    });
  });

  describe('hasChanges detection', () => {
    it('detects changes when status is modified', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('In Progress');
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it('detects changes when assigneeId is modified', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setAssigneeId('user-2');
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it('hasChanges is false when values are reverted to original', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('In Progress');
      });
      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.setStatus('Open');
      });
      expect(result.current.hasChanges).toBe(false);
    });

    it('detects changes when assigneeId changes to null', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setAssigneeId(null);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it('detects changes when severity is modified', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSeverity('Critical');
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it('hasChanges is false when severity reverted to original', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSeverity('Critical');
      });
      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.setSeverity('High');
      });
      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe('setStatus', () => {
    it('updates formValues.status', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });

      expect(result.current.formValues.status).toBe('Resolved');
    });
  });

  describe('setAssigneeId', () => {
    it('updates formValues.assigneeId', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setAssigneeId('user-3');
      });

      expect(result.current.formValues.assigneeId).toBe('user-3');
    });

    it('can set assigneeId to null', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setAssigneeId(null);
      });

      expect(result.current.formValues.assigneeId).toBeNull();
    });
  });

  describe('setSeverity', () => {
    it('updates formValues.severity', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSeverity('Critical');
      });

      expect(result.current.formValues.severity).toBe('Critical');
    });

    it('can change severity to any value', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSeverity('Low');
      });

      expect(result.current.formValues.severity).toBe('Low');

      act(() => {
        result.current.setSeverity('Medium');
      });

      expect(result.current.formValues.severity).toBe('Medium');
    });
  });

  describe('handleCancel', () => {
    it('resets formValues to originalValues', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
        result.current.setAssigneeId('user-2');
      });

      expect(result.current.formValues.status).toBe('Resolved');
      expect(result.current.formValues.assigneeId).toBe('user-2');

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.formValues.status).toBe('Open');
      expect(result.current.formValues.assigneeId).toBe('user-1');
    });

    it('reverts severity to original value on cancel', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSeverity('Critical');
      });

      expect(result.current.formValues.severity).toBe('Critical');

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.formValues.severity).toBe('High');
    });

    it('sets hasChanges to false after cancel', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });
      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.handleCancel();
      });
      expect(result.current.hasChanges).toBe(false);
    });

    it('clears saveError when cancel is clicked', async () => {
      vi.mocked(incidentService.updateIncident).mockRejectedValueOnce(
        new Error('Save failed')
      );

      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });

      await act(async () => {
        try {
          await result.current.handleSave();
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.saveError).not.toBeNull();
      });

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.saveError).toBeNull();
    });
  });

  describe('handleSave', () => {
    it('calls updateIncident mutation with correct data', async () => {
      const updatedIncident = { ...mockIncident, status: 'Resolved' as const };
      vi.mocked(incidentService.updateIncident).mockResolvedValue(updatedIncident);

      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      await waitFor(() => {
        expect(incidentService.updateIncident).toHaveBeenCalledWith('inc-1', {
          status: 'Resolved',
          severity: 'High',
          assigneeId: 'user-1',
        });
      });
    });

    it('includes severity in API payload when saving', async () => {
      const updatedIncident = { ...mockIncident, severity: 'Critical' as const };
      vi.mocked(incidentService.updateIncident).mockResolvedValue(updatedIncident);

      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSeverity('Critical');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      await waitFor(() => {
        expect(incidentService.updateIncident).toHaveBeenCalledWith('inc-1', {
          status: 'Open',
          severity: 'Critical',
          assigneeId: 'user-1',
        });
      });
    });

    it('sets isSaving to true during save operation', async () => {
      let resolveSave: (value: Incident) => void = () => {};
      const savePromise = new Promise<Incident>((resolve) => {
        resolveSave = resolve;
      });
      vi.mocked(incidentService.updateIncident).mockReturnValue(savePromise);

      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });

      let savePromiseResult: Promise<void>;
      act(() => {
        savePromiseResult = result.current.handleSave();
      });

      await waitFor(() => {
        expect(result.current.isSaving).toBe(true);
      });

      await act(async () => {
        resolveSave({ ...mockIncident, status: 'Resolved' });
        await savePromiseResult;
      });
    });

    it('sets saveSuccess to true on successful save', async () => {
      const updatedIncident = { ...mockIncident, status: 'Resolved' as const };
      vi.mocked(incidentService.updateIncident).mockResolvedValue(updatedIncident);

      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      await waitFor(() => {
        expect(result.current.saveSuccess).toBe(true);
      });
    });

    it('sets saveError on failed save', async () => {
      vi.mocked(incidentService.updateIncident).mockRejectedValue(
        new Error('Save failed')
      );

      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });

      await act(async () => {
        try {
          await result.current.handleSave();
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.saveError).not.toBeNull();
      });
    });

    it('updates originalValues after successful save', async () => {
      const updatedIncident = { ...mockIncident, status: 'Resolved' as const };
      vi.mocked(incidentService.updateIncident).mockResolvedValue(updatedIncident);

      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
      });
      expect(result.current.hasChanges).toBe(true);

      await act(async () => {
        await result.current.handleSave();
      });

      await waitFor(() => {
        expect(result.current.hasChanges).toBe(false);
      });
    });
  });

  describe('resetForm', () => {
    it('resets form to original values', () => {
      const { result } = renderHook(() => useIncidentForm(mockIncident), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setStatus('Resolved');
        result.current.setAssigneeId('user-2');
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formValues.status).toBe('Open');
      expect(result.current.formValues.assigneeId).toBe('user-1');
      expect(result.current.hasChanges).toBe(false);
    });
  });
});
