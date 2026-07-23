import { GetJobPostsParams } from '@/api/mocks/community.api';

export const communityQueryKeys = {
  all: ['community'] as const,

  jobs: () => [...communityQueryKeys.all, 'jobs'] as const,
  jobLists: () => [...communityQueryKeys.jobs(), 'list'] as const,
  jobList: (params: GetJobPostsParams) => [...communityQueryKeys.jobLists(), params] as const,
};
