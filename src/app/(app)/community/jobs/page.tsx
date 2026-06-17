'use client';

import JobPostCard from '@/components/community/jobs/JobPostCard';
import { useLikeToggle } from '@/hooks/useLikeToggle';

import { jobPosts as JOB_POSTS } from '@/mocks/posts';

export default function CommunityJobsPage() {
  const { posts: jobPosts, toggleLike } = useLikeToggle(JOB_POSTS);

  return (
    <div>
      {jobPosts?.map((jobPosts) => (
        <JobPostCard
          key={jobPosts.id}
          post={jobPosts}
          onDirectApply={() => {
            // 모달 열기
          }}
          onToggleLike={toggleLike}
        />
      ))}
    </div>
  );
}
