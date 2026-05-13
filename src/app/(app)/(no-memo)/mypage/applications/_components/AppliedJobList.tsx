'use client';

import JobPostCard from '@/components/boards/jobs/JobPostCard';
import { jobPosts } from '@/mocks/posts';

export default function AppliedJobList() {
  const AppliedPosts = jobPosts?.filter((post) => post.isApplied);
  return (
    <>
      {AppliedPosts?.map((post) => (
        <JobPostCard
          key={post.id}
          post={post}
          onDirectApply={() => {
            // 모달 열기
          }}
        />
      ))}
    </>
  );
}
