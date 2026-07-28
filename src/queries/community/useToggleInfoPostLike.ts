import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeInfoPost, unlikeInfoPost } from '@/api/mocks/community.api';
import { communityQueryKeys } from './communityQueryKeys';

import type { TogglePostLikeParams } from '@/types/community';

export function useToggleInfoPostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: TogglePostLikeParams) => {
      return isLiked ? unlikeInfoPost(postId) : likeInfoPost(postId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.infoLists(),
      });
    },
  });
}
