'use client';

import InfoPostCard from '@/components/community/info/InfoPostCard';

import { infoPosts } from '@/mocks/posts';

export default function InfoBookmarkList() {
  const likedPosts = infoPosts.filter((post) => post.isLiked);
  return (
    <>
      {likedPosts?.map((post) => (
        <InfoPostCard key={post.id} post={post} />
      ))}
    </>
  );
}
