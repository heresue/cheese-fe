import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeGroupPost, unlikeGroupPost } from '@/api/mocks/community.api';
import { communityQueryKeys } from './communityQueryKeys';

export type ToggleGroupPostLikeVariables = {
  postId: number;
  isLiked: boolean;
};

export function useToggleGroupPostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: ToggleGroupPostLikeVariables) => {
      return isLiked ? unlikeGroupPost(postId) : likeGroupPost(postId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.groupLists(),
      });
    },
  });
}
