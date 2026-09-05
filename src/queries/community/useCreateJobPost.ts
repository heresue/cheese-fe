import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createJobPost, type CreateJobPostRequest } from '@/api/community.api';

import { communityQueryKeys } from './communityQueryKeys';

export function useCreateJobPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateJobPostRequest) => createJobPost(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.jobLists(),
      });
    },
  });
}
