import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} from '../services/incidentService';
import type { Incident, CreateIncidentInput, UpdateIncidentInput } from '../api/types';

export function useIncidents() {
  return useQuery<Incident[], Error>({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateIncidentInput) => createIncident(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentInput }) =>
      updateIncident(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['incidents'] });

      // Snapshot the previous value
      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);

      // Optimistically update to the new value
      if (previousIncidents) {
        queryClient.setQueryData<Incident[]>(['incidents'], (old) =>
          old?.map((incident) =>
            incident.id === id ? { ...incident, ...data } : incident,
          ),
        );
      }

      // Return a context object with the snapshotted value
      return { previousIncidents };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousIncidents) {
        queryClient.setQueryData(['incidents'], context.previousIncidents);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIncident(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['incidents'] });

      // Snapshot the previous value
      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);

      // Optimistically remove the incident
      if (previousIncidents) {
        queryClient.setQueryData<Incident[]>(
          ['incidents'],
          previousIncidents.filter((incident) => incident.id !== id)
        );
      }

      // Return a context object with the snapshotted value
      return { previousIncidents };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousIncidents) {
        queryClient.setQueryData(['incidents'], context.previousIncidents);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}
