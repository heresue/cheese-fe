import { updatePersonalProfile, type UpdatePersonalProfileRequest } from '@/api/mypage.api';
import { mypageQueryKeys } from '@/queries/mypage/mypageQueryKeys';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdatePersonalProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdatePersonalProfileRequest) => {
      return updatePersonalProfile(request);
    },

    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({
        queryKey: mypageQueryKeys.user(variables.userId),
      });
    },
  });
}
