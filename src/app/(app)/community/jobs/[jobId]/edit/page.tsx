'use client';

import { notFound, useParams } from 'next/navigation';

import { JobPostForm } from '../../_components';
import CommunityListState from '../../../_components/CommunityListState';

import { ApiError } from '@/api/client';
import { useJobPost } from '@/queries/community/useJobPost';

export default function JobEditPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: jobPost, error, isPending, refetch } = useJobPost(jobId);

  if (error instanceof ApiError && error.status === 404) {
    notFound();
  }

  if (isPending) {
    return <CommunityListState type="loading" message="로딩 중..." />;
  }

  if (error || !jobPost) {
    return (
      <CommunityListState
        type="error"
        message="채용공고를 불러오지 못했습니다."
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return <JobPostForm mode="edit" jobId={jobId} initialValues={jobPost} />;
}
