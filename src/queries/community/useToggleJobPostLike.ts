import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeJobPost, unlikeJobPost } from '@/api/mocks/community.api';
import { communityQueryKeys } from './communityQueryKeys';

export type ToggleJobPostLikeVariables = {
  postId: number;
  isLiked: boolean;
};

export function useToggleJobPostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: ToggleJobPostLikeVariables) => {
      return isLiked ? unlikeJobPost(postId) : likeJobPost(postId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.jobLists(),
      });
    },
  });
}
