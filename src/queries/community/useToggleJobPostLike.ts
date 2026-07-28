import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeJobPost, unlikeJobPost } from '@/api/mocks/community.api';
import { communityQueryKeys } from './communityQueryKeys';

import type { TogglePostLikeParams } from '@/types/community';

export function useToggleJobPostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: TogglePostLikeParams) => {
      return isLiked ? unlikeJobPost(postId) : likeJobPost(postId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.jobLists(),
      });
    },
  });
}
