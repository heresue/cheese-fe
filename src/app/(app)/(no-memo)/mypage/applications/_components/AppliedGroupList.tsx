'use client';

import { useMemo } from 'react';

import GroupPostCard from '@/components/community/groups';
import { useLikeToggle } from '@/hooks/useLikeToggle';

import type { ApplicationSort } from '../_constants/applications';

import { groupPosts } from '@/mocks/posts';

type AppliedGroupListProps = {
  sort: ApplicationSort;
  keyword: string;
};

export default function AppliedGroupList({ sort, keyword }: AppliedGroupListProps) {
  const appliedGroupPosts = useMemo(() => groupPosts.filter((post) => post.isApplied), []);

  const { posts, toggleLike } = useLikeToggle(appliedGroupPosts);

  const filteredGroupPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const searchedPosts = posts.filter((post) => {
      if (!normalizedKeyword) {
        return true;
      }

      return (
        post.title.toLowerCase().includes(normalizedKeyword) ||
        post.author.nickname.toLowerCase().includes(normalizedKeyword)
      );
    });

    return [...searchedPosts].sort((a, b) => {
      const difference = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === 'oldest' ? -difference : difference;
    });
  }, [posts, sort, keyword]);

  return (
    <div className="grid w-full max-w-[930px] grid-cols-1 gap-[18px] md:grid-cols-2 xl:grid-cols-3">
      {filteredGroupPosts.map((post) => (
        <GroupPostCard
          key={post.id}
          post={post}
          onToggleLike={({ postId }) => toggleLike(postId)}
        />
      ))}
    </div>
  );
}
