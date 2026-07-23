import type { GetCommunityPostsParams, GetInfoPostsParams } from '@/api/mocks/community.api';

export const communityQueryKeys = {
  all: ['community'] as const,

  jobs: () => [...communityQueryKeys.all, 'jobs'] as const,
  jobLists: () => [...communityQueryKeys.jobs(), 'list'] as const,
  jobList: (params: GetCommunityPostsParams) => [...communityQueryKeys.jobLists(), params] as const,

  groups: () => [...communityQueryKeys.all, 'groups'] as const,
  groupLists: () => [...communityQueryKeys.groups(), 'list'] as const,
  groupList: (params: GetCommunityPostsParams) =>
    [...communityQueryKeys.groupLists(), params] as const,

  info: () => [...communityQueryKeys.all, 'info'] as const,
  infoLists: () => [...communityQueryKeys.info(), 'list'] as const,
  infoList: (params: GetInfoPostsParams) => [...communityQueryKeys.infoLists(), params] as const,
};
