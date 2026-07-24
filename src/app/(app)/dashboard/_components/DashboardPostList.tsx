import Link from 'next/link';

type DashboardPostListProps = {
  title: string;
  href: string;
  posts: {
    id: string;
    category: string;
    title: string;
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
      className="hover:bg-bg-2 flex items-center gap-3 border-b border-gray-200 py-3.5 transition-colors last:border-b-0"
    >
      <span className="w-[64px] shrink-0 text-[12px] leading-[18px] font-medium text-gray-500">
        {post.category}
      </span>

      <p className="text-dashboard-black min-w-0 flex-1 truncate text-[14px] leading-[22px] font-medium">
        {post.title}
      </p>
    </Link>
  );
}

export default function DashboardPostList({ title, href, posts }: DashboardPostListProps) {
  return (
    <div className="min-w-0 flex-1">
      <Link
        href={href}
        className="text-dashboard-black mb-3 inline-flex items-center gap-1 text-[15px] leading-[22px] font-bold hover:underline"
      >
        {title}
        <span aria-hidden="true" className="text-dashboard-gray text-[14px] font-medium">
          ›
        </span>
      </Link>

      <div className="border-t border-gray-200">
        {posts.map((post) => (
          <DashboardPostListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
