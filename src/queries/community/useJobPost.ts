import { useQuery } from '@tanstack/react-query';

import { getJobPost } from '@/api/community.api';
import { ApiError } from '@/api/client';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';

import { communityQueryKeys } from './communityQueryKeys';

export function useJobPost(jobId: string) {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  return useQuery({
    queryKey: communityQueryKeys.jobDetail(jobId, userId),

    queryFn: ({ signal }) => getJobPost({ jobId, userId, signal }),

    enabled: Boolean(jobId) && Boolean(userId),

    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }

      return failureCount < 1;
    },
  });
}
