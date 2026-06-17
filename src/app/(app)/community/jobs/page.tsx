'use client';

import { useSearchParams } from 'next/navigation';

import JobPostCard from '@/components/community/jobs/JobPostCard';
import { useLikeToggle } from '@/hooks/useLikeToggle';

import { jobPosts as JOB_POSTS } from '@/mocks/posts';
import { useMemo } from 'react';
import { getDeadlineTime } from '@/lib/formatDeadline';

export default function CommunityJobsPage() {
  const searchParams = useSearchParams();
  const { posts: jobPosts, toggleLike } = useLikeToggle(JOB_POSTS);

  const sort = searchParams.get('sort') ?? 'latest';
  const keyword = searchParams.get('keyword') ?? '';

  const filteredJobPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return jobPosts
      .filter((post) => {
        if (normalizedKeyword.length === 0) {
          return true;
        }

        return (
          post.title.toLowerCase().includes(normalizedKeyword) ||
          post.companyName.toLowerCase().includes(normalizedKeyword) ||
          post.skills.some((skill) => skill.toLowerCase().includes(normalizedKeyword))
        );
      })
      .sort((a, b) => {
        if (sort === 'like') {
          return b.likeCount - a.likeCount;
        }

        if (sort === 'deadline') {
          return getDeadlineTime(a.deadline) - getDeadlineTime(b.deadline);
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [jobPosts, keyword, sort]);

  return (
    <div>
      {filteredJobPosts?.map((jobPosts) => (
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
