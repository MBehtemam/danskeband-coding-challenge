import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchIncidents,
  fetchIncidentById,
  createIncident,
  updateIncident,
} from './incidentService';
import type { Incident, CreateIncidentInput, UpdateIncidentInput } from '../api/types';

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

describe('incidentService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('fetchIncidents', () => {
    it('should fetch all incidents', async () => {
      const mockIncidents = [mockIncident];
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIncidents),
      } as Response);

      const result = await fetchIncidents();

      expect(global.fetch).toHaveBeenCalledWith('/api/incidents');
      expect(result).toEqual(mockIncidents);
    });

    it('should throw error when fetch fails', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchIncidents()).rejects.toThrow('Failed to fetch incidents');
    });
  });

  describe('fetchIncidentById', () => {
    it('should fetch a single incident by id', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIncident),
      } as Response);

      const result = await fetchIncidentById('inc-1');

      expect(global.fetch).toHaveBeenCalledWith('/api/incidents/inc-1');
      expect(result).toEqual(mockIncident);
    });

    it('should throw error when incident not found', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(fetchIncidentById('inc-999')).rejects.toThrow(
        'Failed to fetch incident',
      );
    });
  });

  describe('createIncident', () => {
    it('should create a new incident', async () => {
      const input: CreateIncidentInput = {
        title: 'New Incident',
        description: 'Description',
        severity: 'High',
        assigneeId: null,
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockIncident, ...input }),
      } as Response);

      const result = await createIncident(input);

      expect(global.fetch).toHaveBeenCalledWith('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result.title).toBe('New Incident');
    });

    it('should throw error when creation fails', async () => {
      const input: CreateIncidentInput = {
        title: '',
        description: '',
        severity: 'High',
        assigneeId: null,
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response);

      await expect(createIncident(input)).rejects.toThrow(
        'Failed to create incident',
      );
    });
  });

  describe('updateIncident', () => {
    it('should update an incident', async () => {
      const input: UpdateIncidentInput = {
        status: 'In Progress',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ ...mockIncident, status: 'In Progress' }),
      } as Response);

      const result = await updateIncident('inc-1', input);

      expect(global.fetch).toHaveBeenCalledWith('/api/incidents/inc-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result.status).toBe('In Progress');
    });

    it('should throw error when update fails', async () => {
      const input: UpdateIncidentInput = {
        status: 'In Progress',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(updateIncident('inc-999', input)).rejects.toThrow(
        'Failed to update incident',
      );
    });
  });
});
