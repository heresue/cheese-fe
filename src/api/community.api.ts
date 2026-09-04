import { apiClient } from '@/api/client';

import type { JobPost } from '@/types/community/community';
import type { JobPostsListParams } from '@/types/community/query';

export type JobPostsResponse = {
  nextCursor: string | null;
  hasMore: boolean;
  items: JobPost[];
};

export function getJobPosts({
  userId,
  sort,
  keyword,
  cursor,
  limit,
  signal,
}: JobPostsListParams & { signal?: AbortSignal }) {
  return apiClient<JobPostsResponse>('/backend-api/community/jobs', {
    method: 'GET',
    cache: 'no-store',
    query: {
      userId,
      sort,
      keyword,
      cursor,
      limit: limit?.toString(),
    },
    signal,
  });
}
