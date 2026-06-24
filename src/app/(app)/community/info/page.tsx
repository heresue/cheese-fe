'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import InfoPostCard from '@/components/community/info/InfoPostCard';

import { useLikeToggle } from '@/hooks/useLikeToggle';

import { infoPosts as INFO_POSTS } from '@/mocks/posts';

const INFO_CATEGORY_LABEL = {
  question: '질문글',
  info: '정보글',
  resource: '자료공유',
} as const;

type InfoCategoryValue = 'all' | keyof typeof INFO_CATEGORY_LABEL;

export default function CommunityInfoPage() {
  const searchParams = useSearchParams();
  const { posts: infoPosts, toggleLike } = useLikeToggle(INFO_POSTS);

  const category = (searchParams.get('sort') ?? 'all') as InfoCategoryValue;
  const keyword = searchParams.get('keyword') ?? '';

  const filteredInfoPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const selectedCategory = category === 'all' ? null : INFO_CATEGORY_LABEL[category];

    return infoPosts
      .filter((post) => {
        if (selectedCategory && post.category !== selectedCategory) {
          return false;
        }

        if (normalizedKeyword.length === 0) {
          return true;
        }

        return (
          post.title.toLowerCase().includes(normalizedKeyword) ||
          post.content.toLowerCase().includes(normalizedKeyword) ||
          post.author.nickname.toLowerCase().includes(normalizedKeyword) ||
          post.category.toLowerCase().includes(normalizedKeyword) ||
          post.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword))
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [infoPosts, keyword, category]);

  return (
    <div className="mx-auto flex flex-col px-[50px]">
      {filteredInfoPosts.map((infoPost) => (
        <InfoPostCard
          key={infoPost.id}
          post={infoPost}
          onToggleLike={toggleLike}
          wrapperClassName="py-8"
        />
      ))}
    </div>
  );
}
