import { jobPosts } from '@/mocks/posts';
import { getDeadlineTime, isRecruitClosed } from '@/lib/formatDeadline';

import type { JobPost } from '@/types/community';
import type { CommunitySort } from '@/app/(app)/community/_constants/community';

/* ================================
     커뮤니티 목록
   ================================ */

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

/* ================================
     좋아요
   ================================ */

type LikeablePost = {
  id: number;
  isLiked: boolean;
  likeCount: number;
};

function updatePostLike(posts: LikeablePost[], postId: number, nextIsLiked: boolean): void {
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  const post = posts[postIndex];

  if (post.isLiked === nextIsLiked) {
    return;
  }

  posts[postIndex] = {
    ...post,
    isLiked: nextIsLiked,
    likeCount: Math.max(0, post.likeCount + (nextIsLiked ? 1 : -1)),
  };
}

export async function likeJobPost(postId: number): Promise<void> {
  updatePostLike(jobPosts, postId, true);
}

export async function unlikeJobPost(postId: number): Promise<void> {
  updatePostLike(jobPosts, postId, false);
}
