'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CategoryTabs } from '@/components/common/CategoryTabs';
import ListFilterBar from '@/components/common/ListFilterBar';

import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import {
  COMMUNITY_CATEGORY_TABS,
  COMMUNITY_SORT_OPTIONS,
  INFO_SORT_OPTIONS,
} from './_constants/community';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParams = useUpdateSearchParams();

  const isInfoPage = pathname.startsWith('/community/info');
  const shouldShowFilterBar = !pathname.endsWith('/new');

  const sortOptions = isInfoPage ? INFO_SORT_OPTIONS : COMMUNITY_SORT_OPTIONS;
  const defaultSort = isInfoPage ? 'all' : 'latest';
  const communitySort = searchParams.get('sort') ?? defaultSort;
  const [communityKeyword, setCommunityKeyword] = useState(searchParams.get('keyword') ?? '');

  const activeCategory =
    COMMUNITY_CATEGORY_TABS.find((tab) => pathname.startsWith(tab.value))?.value ??
    '/community/jobs';

  const createPostHref = `${activeCategory}/new`;

  console.log(pathname);
  console.log(pathname.endsWith('/new'));

  return (
    <div className="h-dvh overflow-y-auto px-10 pt-10">
      <div className="mx-auto mb-8 flex w-full max-w-[1100px] flex-col gap-8">
        <div className="flex flex-col gap-5">
          {shouldShowFilterBar && (
            <ListFilterBar
              sortOptions={sortOptions}
              selectedSort={communitySort}
              searchValue={communityKeyword}
              searchPlaceholder="검색"
              searchHistories={['프론트엔드', '스터디 모집', '포트폴리오', '채용공고']}
              onSortChange={(value) => {
                updateSearchParams('sort', value);
              }}
              onSearchChange={setCommunityKeyword}
              onSearchSubmit={(value) => {
                updateSearchParams('keyword', value);
              }}
              onSearchHistorySelect={(value) => {
                setCommunityKeyword(value);
                updateSearchParams('keyword', value);
              }}
              actionButton={{
                label: '생성',
                onClick: () => {
                  router.push(createPostHref);
                },
              }}
            />
          )}

          <CategoryTabs
            items={COMMUNITY_CATEGORY_TABS}
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
