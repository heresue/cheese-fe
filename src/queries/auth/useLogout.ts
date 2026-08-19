import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '@/api/auth.api';

import { authQueryKeys } from './authQueryKeys';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authQueryKeys.me(),
      });
    },
  });
}
