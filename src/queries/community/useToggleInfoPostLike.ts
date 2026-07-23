import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeInfoPost, unlikeInfoPost } from '@/api/mocks/community.api';
import { communityQueryKeys } from './communityQueryKeys';

export type ToggleInfoPostLikeVariables = {
  postId: number;
  isLiked: boolean;
};

export function useToggleInfoPostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: ToggleInfoPostLikeVariables) => {
      return isLiked ? unlikeInfoPost(postId) : likeInfoPost(postId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.infoLists(),
      });
    },
  });
}
