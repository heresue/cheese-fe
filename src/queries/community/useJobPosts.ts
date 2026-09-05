import { useInfiniteQuery } from '@tanstack/react-query';

import { communityQueryKeys } from './communityQueryKeys';

import { getJobPosts } from '@/api/community.api';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';

import type { JobPostsListParams } from '@/types/community/query';

export function useJobPosts(params: JobPostsListParams) {
  const { data: currentUser } = useCurrentUser();
  const requestParams = { ...params, userId: currentUser?.id };

  return useInfiniteQuery({
    queryKey: communityQueryKeys.jobList(requestParams),

    queryFn: ({ pageParam, signal }) =>
      getJobPosts({ ...requestParams, cursor: pageParam, signal }),

    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
    },

    enabled: !!currentUser,
  });
}
