'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import JobPostCard from '@/components/community/jobs/JobPostCard';

import CommunityListState from '../_components/CommunityListState';
import ApplyModal from '../_components/ApplyModal';

import { isCommunitySort } from '@/app/(app)/community/_constants/community';

import { useJobPosts } from '@/queries/community/useJobPosts';
import { useToggleJobPostLike } from '@/queries/community/useToggleJobPostLike';

import type { JobPost } from '@/types/community/community';

export default function CommunityJobsPage() {
  const searchParams = useSearchParams();
  const [selectedApplyPost, setSelectedApplyPost] = useState<JobPost | null>(null);

  const sortParam = searchParams.get('sort');
  const sort = isCommunitySort(sortParam) ? sortParam : 'latest';
  const keyword = searchParams.get('keyword') ?? '';

  const { data: jobPosts = [], isPending, isError, refetch } = useJobPosts({ sort, keyword });

  // TODO: API 연동 후 좋아요 캐시 갱신 방식 최적화
  const { mutate: toggleJobPostLike } = useToggleJobPostLike();

  if (isPending) {
    return <CommunityListState type="loading" message="로딩 중..." />;
  }

  if (isError) {
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

  if (jobPosts.length === 0) {
    return (
      <CommunityListState
        type="empty"
        message={keyword ? '검색 결과가 없습니다.' : '등록된 채용공고가 없습니다.'}
      />
    );
  }

  return (
    <div>
      {jobPosts.map((jobPost) => (
        <JobPostCard
          key={jobPost.id}
          post={jobPost}
          onDirectApply={() => setSelectedApplyPost(jobPost)}
          onToggleLike={toggleJobPostLike}
        />
      ))}

      {selectedApplyPost && (
        <ApplyModal post={selectedApplyPost} isOpen onClose={() => setSelectedApplyPost(null)} />
      )}
    </div>
  );
}
