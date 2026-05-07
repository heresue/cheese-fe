'use client';

import { useState } from 'react';

import { CategoryTabs } from '@/components/common/CategoryTabs';
import { ListFilterBar } from '@/components/common/ListFilterBar';

const PROBLEM_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '진행일순', value: 'progressDate' },
  { label: '이름순', value: 'name' },
] as const;

const COMMUNITY_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '마감일순', value: 'deadline' },
  { label: '좋아요순', value: 'like' },
] as const;

const PROBLEM_CATEGORY_TABS = [
  { label: '전체', value: 'all' },
  { label: '프론트엔드', value: 'frontend' },
  { label: '백엔드', value: 'backend' },
  { label: 'CS', value: 'cs' },
] as const;

const COMMUNITY_CATEGORY_TABS = [
  { label: '채용공고', value: 'job' },
  { label: '그룹모집', value: 'group' },
  { label: '정보/자료공유', value: 'info' },
] as const;

const PROBLEM_SEARCH_HISTORIES = ['CSS', 'Next.js', 'cursor', '표준모드', '라우팅'] as const;

const COMMUNITY_SEARCH_HISTORIES = ['프론트엔드', '스터디 모집', '포트폴리오', '채용공고'] as const;

type ProblemSortValue = (typeof PROBLEM_SORT_OPTIONS)[number]['value'];
type CommunitySortValue = (typeof COMMUNITY_SORT_OPTIONS)[number]['value'];
type ProblemCategoryValue = (typeof PROBLEM_CATEGORY_TABS)[number]['value'];
type CommunityCategoryValue = (typeof COMMUNITY_CATEGORY_TABS)[number]['value'];

export default function ProblemPage() {
  const [problemSort, setProblemSort] = useState<ProblemSortValue>('latest');
  const [problemKeyword, setProblemKeyword] = useState('');
  const [problemCategory, setProblemCategory] = useState<ProblemCategoryValue>('all');

  const [communitySort, setCommunitySort] = useState<CommunitySortValue>('latest');
  const [communityKeyword, setCommunityKeyword] = useState('');
  const [communityCategory, setCommunityCategory] = useState<CommunityCategoryValue>('job');

  const [tabsOnlyCategory, setTabsOnlyCategory] = useState<CommunityCategoryValue>('job');

  return (
    <main className="px-10 py-10">
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-[18px]">
          <ListFilterBar
            sortOptions={PROBLEM_SORT_OPTIONS}
            selectedSort={problemSort}
            searchValue={problemKeyword}
            searchPlaceholder="검색"
            searchHistories={PROBLEM_SEARCH_HISTORIES}
            onSortChange={setProblemSort}
            onSearchChange={setProblemKeyword}
            onSearchSubmit={(value) => {
              console.log('[문제풀이] 검색어:', value);
            }}
            onSearchClear={() => {
              console.log('[문제풀이] 검색어 삭제');
            }}
            onSearchHistorySelect={(value) => {
              console.log('[문제풀이] 검색 기록 선택:', value);
            }}
          />

          <CategoryTabs
            items={PROBLEM_CATEGORY_TABS}
            activeValue={problemCategory}
            onChange={setProblemCategory}
          />
        </section>

        <section className="flex flex-col gap-[18px]">
          <ListFilterBar
            sortOptions={COMMUNITY_SORT_OPTIONS}
            selectedSort={communitySort}
            searchValue={communityKeyword}
            searchPlaceholder="검색"
            searchHistories={COMMUNITY_SEARCH_HISTORIES}
            onSortChange={setCommunitySort}
            onSearchChange={setCommunityKeyword}
            onSearchSubmit={(value) => {
              console.log('[커뮤니티] 검색어:', value);
            }}
            onSearchClear={() => {
              console.log('[커뮤니티] 검색어 삭제');
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
            activeValue={communityCategory}
            onChange={setCommunityCategory}
          />
        </section>

        <section>
          <CategoryTabs
            items={COMMUNITY_CATEGORY_TABS}
            activeValue={tabsOnlyCategory}
            onChange={setTabsOnlyCategory}
          />
        </section>
      </div>
    </main>
  );
}
