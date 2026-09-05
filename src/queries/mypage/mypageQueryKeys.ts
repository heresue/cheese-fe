import type { JobApplicationsParams } from '@/api/mypage.api';

export const mypageQueryKeys = {
  all: ['mypage'] as const,

  user: (userId: string | undefined) => [...mypageQueryKeys.all, userId] as const,
  jobApplications: (userId: string | undefined) =>
    [...mypageQueryKeys.user(userId), 'applications', 'jobs'] as const,
  jobApplicationList: (
    userId: string | undefined,
    params: Omit<JobApplicationsParams, 'userId' | 'cursor'>,
  ) => [...mypageQueryKeys.jobApplications(userId), params] as const,
};
