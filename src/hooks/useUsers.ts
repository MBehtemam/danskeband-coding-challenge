import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../services/userService';
import type { User } from '../api/types';

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // Users don't change often, cache for 5 minutes
  });
}
