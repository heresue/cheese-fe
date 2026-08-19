import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@/api/client';
import { getMe } from '@/api/auth.api';

import { authQueryKeys } from './authQueryKeys';

export function useCurrentUser() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: getMe,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }

      return failureCount < 1;
    },
  });
}
