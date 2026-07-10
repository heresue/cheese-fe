import Link from 'next/link';

import { CommunityIcon } from '@/assets/icons/sidebar';
import { groupPosts, infoPosts, jobPosts } from '@/mocks/posts';

import DashboardPostList from './DashboardPostList';
import DashboardSectionHeader from './DashboardSectionHeader';

type PopularPostItem = {
  id: string;
  category: string;
  title: string;
  likeCount: number;
  commentCount: number;
  href: string;
};

function toPopularPosts(): { daily: PopularPostItem[]; weekly: PopularPostItem[] } {
  const items: PopularPostItem[] = [
    ...jobPosts.map((post) => ({
      id: `job-${post.id}`,
      category: '채용공고',
      title: post.title,
      likeCount: post.likeCount,
      commentCount: post.viewCount,
      href: `/community/jobs/${post.id}`,
    })),
    ...groupPosts.map((post) => ({
      id: `group-${post.id}`,
      category: '그룹모집',
      title: post.title,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      href: `/community/groups/${post.id}`,
    })),
    ...infoPosts.map((post) => ({
      id: `info-${post.id}`,
      category: post.category === 'question' ? 'Q&A' : post.category === 'resource' ? '자료공유' : '정보',
      title: post.title,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      href: `/community/info/${post.id}`,
    })),
  ];

  const sorted = [...items].sort((a, b) => b.likeCount - a.likeCount);

  return {
    daily: sorted.slice(0, 4),
    weekly: sorted.slice(0, 4),
  };
}

export default function DashboardCommunitySection() {
  const popularPosts = toPopularPosts();

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <DashboardSectionHeader icon={<CommunityIcon />} title="커뮤니티" className="mb-0" />

        <Link
          href="/community"
          className="text-dashboard-navy text-[13px] leading-[20px] font-medium hover:underline"
        >
          커뮤니티 바로가기
        </Link>
      </div>

      {popularPosts.daily.length > 0 ? (
        <div className="flex gap-6">
          <DashboardPostList title="일간 인기 게시글" posts={popularPosts.daily} />
          <DashboardPostList title="주간 인기 게시글" posts={popularPosts.weekly} />
        </div>
      ) : (
        <div className="border-border flex min-h-[160px] flex-col items-center justify-center rounded-[10px] border bg-white p-8 text-center">
          <p className="text-dashboard-gray text-[14px] leading-[22px] font-medium">
            인기 게시글이 없습니다.
          </p>

          <Link
            href="/community"
            className="text-dashboard-navy mt-3 text-[14px] leading-[22px] font-medium hover:underline"
          >
            커뮤니티 둘러보기
          </Link>
        </div>
      )}
    </section>
  );
}
