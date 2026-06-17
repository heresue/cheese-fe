'use client';

import JobPostCard from '@/components/community/jobs/JobPostCard';
import { jobPosts } from '@/mocks/posts';

export default function CommunityJobsPage() {
  return (
    <div>
      {jobPosts?.map((post) => (
        <JobPostCard
          key={post.id}
          post={post}
          onDirectApply={() => {
            // 모달 열기
          }}
        />
      ))}
    </div>
  );
}
