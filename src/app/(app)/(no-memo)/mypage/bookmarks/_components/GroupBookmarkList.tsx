import GroupPostCard from '@/components/community/groups/GroupPostCard';

import { groupPosts } from '@/mocks/posts';

export default function GroupBookmarkList() {
  const likedPosts = groupPosts.filter((post) => post.isLiked);

  return (
    <div className="grid w-full max-w-[930px] grid-cols-1 gap-[18px] md:grid-cols-2 xl:grid-cols-3">
      {likedPosts?.map((post) => (
        <GroupPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
