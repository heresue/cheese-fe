import { updateAccountSettings } from '@/api/mypage.api';
import { mypageQueryKeys } from '@/queries/mypage/mypageQueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateAccountSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountSettings,

    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({
        queryKey: mypageQueryKeys.user(variables.userId),
      });
    },
  });
}
