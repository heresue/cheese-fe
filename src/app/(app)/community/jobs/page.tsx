'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import JobPostCard from '@/components/community/jobs/JobPostCard';

import ApplyModal from '../_components/ApplyModal';

import { useLikeToggle } from '@/hooks/useLikeToggle';

import { getJobPosts } from '@/api/mocks/community.api';

import type { JobPost } from '@/types/community';
import { isCommunitySort } from '@/app/(app)/community/_constants/community';

export default function CommunityJobsPage() {
  const searchParams = useSearchParams();
  // const { posts: jobPosts, toggleLike } = useLikeToggle(JOB_POSTS);
  const [selectedApplyPost, setSelectedApplyPost] = useState<JobPost | null>(null);

  const sortParam = searchParams.get('sort');
  const sort = isCommunitySort(sortParam) ? sortParam : 'latest';
  const keyword = searchParams.get('keyword') ?? '';

  const {
    data: jobPosts = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ['jobPosts', { sort, keyword }],
    queryFn: () => getJobPosts({ sort, keyword }),
  });

  if (isPending) {
    return <div>불러오는 중입니다.</div>;
  }

  if (isError) {
    return <div>채용공고를 불러오지 못했습니다.</div>;
  }

  return (
    <div>
      {jobPosts.map((jobPost) => (
        <JobPostCard
          key={jobPost.id}
          post={jobPost}
          onDirectApply={() => setSelectedApplyPost(jobPost)}
          // onToggleLike={toggleLike}
        />
      ))}

      {selectedApplyPost && (
        <ApplyModal post={selectedApplyPost} isOpen onClose={() => setSelectedApplyPost(null)} />
      )}
    </div>
  );
}
