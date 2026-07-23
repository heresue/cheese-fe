'use client';

import { useLikeToggle } from '@/hooks/useLikeToggle';
import JobPostCard from '@/components/community/jobs/JobPostCard';

import { jobPosts } from '@/mocks/posts';

export default function AppliedJobList() {
  const appliedPosts = jobPosts
    .filter((post) => post.isApplied && post.apply.type === 'direct')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const { posts, toggleLike } = useLikeToggle(appliedPosts);

  return (
    <>
      {posts.map((post) => (
        <JobPostCard
          key={post.id}
          post={post}
          onDirectApply={() => {
            // TODO: 지원현황 UX 결정 후 적용
          }}
          onToggleLike={({ postId }) => toggleLike(postId)}
        />
      ))}
    </>
  );
}
