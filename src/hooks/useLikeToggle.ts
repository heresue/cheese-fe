import { useState } from 'react';

type LikeablePost = {
  id: number;
  isLiked: boolean;
};

export function useLikeToggle<T extends LikeablePost>(initialPosts: T[]) {
  const [posts, setPosts] = useState(initialPosts);

  const toggleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, isLiked: !post.isLiked } : post)),
    );
  };

  return {
    posts,
    setPosts,
    toggleLike,
  };
}
