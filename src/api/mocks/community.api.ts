import { jobPosts } from '@/mocks/posts';
import { getDeadlineTime, isRecruitClosed } from '@/lib/formatDeadline';

import type { JobPost } from '@/types/community';
import type { CommunitySort } from '@/app/(app)/community/_constants/community';

// 목록

export type GetJobPostsParams = {
  sort?: CommunitySort;
  keyword?: string;
};

export async function getJobPosts({
  sort = 'latest',
  keyword = '',
}: GetJobPostsParams = {}): Promise<JobPost[]> {
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredPosts = jobPosts.filter((post) => {
    if (!normalizedKeyword) {
      return true;
    }

    return (
      post.title.toLowerCase().includes(normalizedKeyword) ||
      post.companyName.toLowerCase().includes(normalizedKeyword) ||
      post.author.nickname.toLowerCase().includes(normalizedKeyword) ||
      post.skills.some((skill) => skill.toLowerCase().includes(normalizedKeyword))
    );
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sort === 'like') {
      return b.likeCount - a.likeCount;
    }

    if (sort === 'deadline') {
      const aClosed = isRecruitClosed(a.deadline);
      const bClosed = isRecruitClosed(b.deadline);

      if (aClosed !== bClosed) {
        return aClosed ? 1 : -1;
      }

      return getDeadlineTime(a.deadline) - getDeadlineTime(b.deadline);
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sortedPosts;
}
