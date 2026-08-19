import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login } from '@/api/auth.api';

import { authQueryKeys } from './authQueryKeys';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me(), user);
    },
  });
}
