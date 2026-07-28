import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeGroupPost, unlikeGroupPost } from '@/api/mocks/community.api';
import { communityQueryKeys } from './communityQueryKeys';

import type { TogglePostLikeParams } from '@/types/community/community';

export function useToggleGroupPostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: TogglePostLikeParams) => {
      return isLiked ? unlikeGroupPost(postId) : likeGroupPost(postId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.groupLists(),
      });
    },
  });
}
