import { useInfiniteQuery } from '@tanstack/react-query';

import { getJobApplications, type JobApplicationsParams } from '@/api/mypage.api';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';
import { mypageQueryKeys } from './mypageQueryKeys';

export function useJobApplications(params: Omit<JobApplicationsParams, 'userId' | 'cursor'>) {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  return useInfiniteQuery({
    queryKey: mypageQueryKeys.jobApplicationList(userId, params),
    queryFn: ({ pageParam, signal }) => {
      if (!userId) throw new Error('로그인 사용자 정보가 필요합니다.');
      return getJobApplications({ ...params, userId, cursor: pageParam }, signal);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: Boolean(userId),
  });
}
