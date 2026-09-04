import { apiClient } from '@/api/client';

import type { ApplyInfo, JobPost } from '@/types/community/community';
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

type GetJobPostParams = {
  jobId: string;
  userId?: string;
  signal?: AbortSignal;
};

export function getJobPost({ jobId, userId, signal }: GetJobPostParams) {
  return apiClient<JobPost>(`/backend-api/community/jobs/${jobId}`, {
    method: 'GET',
    cache: 'no-store',
    query: { userId },
    signal,
  });
}

export type CreateJobPostRequest = {
  userId: string;
  companyName: string;
  title: string;
  field: string[];
  employmentType: string;
  location: string;
  education: string;
  career: string;
  skills: string[];
  deadline: string | null;
  apply: ApplyInfo;
  content: string;
};

export function createJobPost(request: CreateJobPostRequest) {
  return apiClient<JobPost>('/backend-api/community/jobs', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export type UpdateJobPostRequest = {
  jobId: string;
  userId: string;
  data: Omit<CreateJobPostRequest, 'userId'>;
};

export function updateJobPost({ jobId, userId, data }: UpdateJobPostRequest) {
  return apiClient<JobPost>(`/backend-api/community/jobs/${jobId}`, {
    method: 'PATCH',
    query: { userId },
    body: JSON.stringify(data),
  });
}

export type DeleteJobPostRequest = {
  jobId: string;
  userId: string;
};

export function deleteJobPost({ jobId, userId }: DeleteJobPostRequest) {
  return apiClient<JobPost>(`/backend-api/community/jobs/${jobId}`, {
    method: 'DELETE',
    query: { userId },
  });
}

export type JobPostLikeRequest = {
  jobId: string;
  userId: string;
};

export type JobPostLikeResponse = {
  isLiked: boolean;
};

export function likeJobPost({ jobId, userId }: JobPostLikeRequest) {
  return apiClient<JobPostLikeResponse>(`/backend-api/community/jobs/${jobId}/like`, {
    method: 'POST',
    query: { userId },
  });
}

export function unlikeJobPost({ jobId, userId }: JobPostLikeRequest) {
  return apiClient<JobPostLikeResponse>(`/backend-api/community/jobs/${jobId}/like`, {
    method: 'DELETE',
    query: { userId },
  });
}
