'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { CategoryTabs } from '@/components/common/CategoryTabs';
import ListFilterBar from '@/components/common/ListFilterBar';

const COMMUNITY_CATEGORY_TABS = [
  { label: '채용공고', value: '/community/jobs' },
  { label: '그룹모집', value: '/community/groups' },
  { label: '정보/자료공유', value: '/community/info' },
] as const;

const COMMUNITY_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '마감일순', value: 'deadline' },
  { label: '좋아요순', value: 'like' },
] as const;

type CommunityCategoryValue = (typeof COMMUNITY_CATEGORY_TABS)[number]['value'];
type CommunitySortValue = (typeof COMMUNITY_SORT_OPTIONS)[number]['value'];

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [communitySort, setCommunitySort] = useState<CommunitySortValue>('latest');
  const [communityKeyword, setCommunityKeyword] = useState('');

  return (
    <div className="h-full overflow-y-auto px-10 pt-10">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8">
        <div className="flex flex-col gap-5">
          <ListFilterBar
            sortOptions={COMMUNITY_SORT_OPTIONS}
            selectedSort={communitySort}
            searchValue={communityKeyword}
            searchPlaceholder="검색"
            searchHistories={['프론트엔드', '스터디 모집', '포트폴리오', '채용공고']}
            onSortChange={setCommunitySort}
            onSearchChange={setCommunityKeyword}
            onSearchSubmit={(value) => {
              console.log('[커뮤니티] 검색어:', value);
            }}
            onSearchHistorySelect={(value) => {
              console.log('[커뮤니티] 검색 기록 선택:', value);
            }}
            actionButton={{
              label: '생성',
              onClick: () => {
                console.log('생성 버튼 클릭');
              },
            }}
          />

          <CategoryTabs
            items={COMMUNITY_CATEGORY_TABS}
            activeValue={pathname as CommunityCategoryValue}
            onChange={(href) => {
              router.push(href);
            }}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
