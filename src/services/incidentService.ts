import type { Incident, CreateIncidentInput, UpdateIncidentInput } from '../api/types';

export async function fetchIncidents(): Promise<Incident[]> {
  const response = await fetch('/api/incidents');
  if (!response.ok) {
    throw new Error('Failed to fetch incidents');
  }
  return response.json();
}

export async function fetchIncidentById(id: string): Promise<Incident> {
  const response = await fetch(`/api/incidents/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch incident');
  }
  return response.json();
}

export async function createIncident(input: CreateIncidentInput): Promise<Incident> {
  const response = await fetch('/api/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error('Failed to create incident');
  }
  return response.json();
}

export async function updateIncident(
  id: string,
  input: UpdateIncidentInput,
): Promise<Incident> {
  const response = await fetch(`/api/incidents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error('Failed to update incident');
  }
  return response.json();
}
