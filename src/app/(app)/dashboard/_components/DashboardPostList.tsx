import Link from 'next/link';

import LikeFilledIcon from '@/assets/icons/common/like-filled.svg';

type DashboardPostListProps = {
  title: string;
  posts: {
    id: string;
    category: string;
    title: string;
    likeCount: number;
    commentCount: number;
    href: string;
  }[];
};

function DashboardPostListItem({
  post,
}: {
  post: DashboardPostListProps['posts'][number];
}) {
  return (
    <Link
      href={post.href}
      className="border-border hover:bg-bg-2 flex items-center gap-4 border-b px-1 py-4 transition-colors last:border-b-0"
    >
      <span className="text-dashboard-gray shrink-0 text-[12px] leading-[18px] font-bold">
        {post.category}
      </span>

      <p className="text-dashboard-black min-w-0 flex-1 truncate text-[14px] leading-[22px] font-medium">
        {post.title}
      </p>

      <div className="text-dashboard-gray flex shrink-0 items-center gap-4 text-[12px] leading-[18px]">
        <span className="flex items-center gap-1">
          <LikeFilledIcon className="text-dashboard-pink h-3.5 w-3.5" aria-hidden="true" />
          {post.likeCount}
        </span>
        <span className="flex items-center gap-1">
          <span aria-hidden="true">💬</span>
          {post.commentCount}
        </span>
      </div>
    </Link>
  );
}

export default function DashboardPostList({ title, posts }: DashboardPostListProps) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="text-dashboard-black mb-3 text-[15px] leading-[22px] font-bold">{title}</h3>

      <div className="border-border rounded-[10px] border bg-white px-4">
        {posts.map((post) => (
          <DashboardPostListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
