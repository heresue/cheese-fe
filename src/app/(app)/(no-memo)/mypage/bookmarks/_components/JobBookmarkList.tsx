'use client';

import JobPostCard from '@/components/community/jobs/JobPostCard';

import { jobPosts } from '@/mocks/posts';

export default function JobBookmarkList() {
  const likedPosts = jobPosts?.filter((post) => post.isLiked);

  return (
    <>
      {likedPosts?.map((post) => (
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
