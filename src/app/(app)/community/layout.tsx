'use client';

import { useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CategoryTabs } from '@/components/common/CategoryTabs';
import ListFilterBar from '@/components/common/ListFilterBar';
import { useSearchHistories } from '@/hooks/useSearchHistories';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';

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

const INFO_SORT_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '질문글', value: 'question' },
  { label: '정보글', value: 'info' },
  { label: '자료공유', value: 'resource' },
] as const;

const COMMUNITY_SEARCH_HISTORIES = ['프론트엔드', '스터디 모집', '포트폴리오', '채용공고'] as const;

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParams = useUpdateSearchParams();

  const isInfoPage = pathname.startsWith('/community/info');

  const sortOptions = isInfoPage ? INFO_SORT_OPTIONS : COMMUNITY_SORT_OPTIONS;
  const defaultSort = isInfoPage ? 'all' : 'latest';
  const communitySort = searchParams.get('sort') ?? defaultSort;

  const [communityKeyword, setCommunityKeyword] = useState(searchParams.get('keyword') ?? '');

  const { histories: communitySearchHistories, addHistory: addCommunitySearchHistory } =
    useSearchHistories('community', COMMUNITY_SEARCH_HISTORIES);

  const activeCategory =
    COMMUNITY_CATEGORY_TABS.find((tab) => pathname.startsWith(tab.value))?.value ??
    '/community/jobs';

  const handleSearchSubmit = (value: string) => {
    const normalizedValue = value.trim();

    if (normalizedValue) {
      addCommunitySearchHistory(normalizedValue);
    }

    setCommunityKeyword(normalizedValue);
    updateSearchParams('keyword', normalizedValue);
  };

  const handleSearchClear = () => {
    setCommunityKeyword('');
    updateSearchParams('keyword', '');
  };

  const handleSearchHistorySelect = (value: string) => {
    const normalizedValue = value.trim();

    if (normalizedValue) {
      addCommunitySearchHistory(normalizedValue);
    }

    setCommunityKeyword(normalizedValue);
    updateSearchParams('keyword', normalizedValue);
  };

  return (
    <div className="h-dvh overflow-y-auto px-10 pt-10">
      <div className="mx-auto mb-8 flex w-full max-w-[1100px] flex-col gap-8">
        <div className="flex flex-col gap-5">
          <ListFilterBar
            sortOptions={[...sortOptions]}
            selectedSort={communitySort}
            searchValue={communityKeyword}
            searchPlaceholder="검색"
            searchHistories={communitySearchHistories}
            onSortChange={(value) => {
              updateSearchParams('sort', value);
            }}
            onSearchChange={setCommunityKeyword}
            onSearchSubmit={handleSearchSubmit}
            onSearchClear={handleSearchClear}
            onSearchHistorySelect={handleSearchHistorySelect}
            actionButton={{
              label: '생성',
              onClick: () => {
                // 생성 열기
              },
            }}
          />

          <CategoryTabs
            items={[...COMMUNITY_CATEGORY_TABS]}
            activeValue={activeCategory}
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
