import InfoPostCard from '@/components/community/info';

import { useBookmarkedPosts } from '../hooks/useBookmarkedPosts';

import { infoPosts } from '@/mocks/posts';

export default function InfoBookmarkList() {
  const { bookmarkedPosts: bookmarkedInfoPosts, toggleLike } = useBookmarkedPosts(infoPosts);

  const handleToggleLike = ({ postId }: { postId: number; isLiked: boolean }) => {
    toggleLike(postId);
  };

  return (
    <>
      {bookmarkedInfoPosts?.map((post) => (
        <InfoPostCard key={post.id} post={post} onToggleLike={handleToggleLike} />
      ))}
    </>
  );
}
