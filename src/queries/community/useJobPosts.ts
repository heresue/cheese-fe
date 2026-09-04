import { useQuery } from '@tanstack/react-query';

import { communityQueryKeys } from './communityQueryKeys';

import { getJobPosts } from '@/api/community.api';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';

import type { CommunityPostsListParams } from '@/types/community/query';

export function useJobPosts(params: CommunityPostsListParams) {
  const { data: currentUser } = useCurrentUser();
  const requestParams = { ...params, userId: currentUser?.id };

  return useQuery({
    queryKey: communityQueryKeys.jobList(requestParams),
    queryFn: ({ signal }) => getJobPosts({ ...requestParams, signal }),
    select: (response) => response.items,
  });
}
