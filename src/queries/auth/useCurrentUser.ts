import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/api/auth.api';

import { authQueryKeys } from './authQueryKeys';

export function useCurrentUser() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: getMe,
    retry: false,
  });
}
