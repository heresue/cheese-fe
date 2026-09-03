import { updateCompanyProfile, type UpdateCompanyProfileRequest } from '@/api/mypage.api';
import { mypageQueryKeys } from '@/queries/mypage/mypageQueryKeys';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateCompanyProfileRequest) => {
      return updateCompanyProfile(request);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: mypageQueryKeys.user(variables.userId),
      });
    },
  });
}
