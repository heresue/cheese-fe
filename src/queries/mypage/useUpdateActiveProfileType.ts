import { updateActiveProfileType, type UpdateActiveProfileTypeRequest } from '@/api/mypage.api';
import { mypageQueryKeys } from '@/queries/mypage/mypageQueryKeys';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateActiveProfileType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateActiveProfileTypeRequest) => {
      return updateActiveProfileType(request);
    },

    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({
        queryKey: mypageQueryKeys.user(variables.userId),
      });
    },
  });
}
