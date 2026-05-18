'use client';

import { useMemo, useState } from 'react';

import { CategoryTabs } from '@/components/common/CategoryTabs';
import { ListFilterBar } from '@/components/common/ListFilterBar';

import ProblemCardGrid from '../components/ProblemCardGrid';
import ProblemSubCategoryTabs from '../components/ProblemSubCategoryTabs';
import {
  PROBLEM_MAIN_CATEGORY_TABS,
  PROBLEM_SORT_OPTIONS,
  PROBLEM_SUB_CATEGORY_TABS,
} from '../constants/problemFilters';
import { mockProblemSets } from '../data/mockProblemSets';
import type { ProblemMainCategory, ProblemSortValue, ProblemSubCategory } from '../types/problem';
import { filterProblemSets } from '../utils/filterProblemSets';

const PROBLEM_SEARCH_HISTORIES = ['CSS', 'Next.js', 'cursor', '표준모드', '라우팅'] as const;

export default function ProblemListView() {
  const [sort, setSort] = useState<ProblemSortValue>('latest');
  const [keyword, setKeyword] = useState('');
  const [mainCategory, setMainCategory] = useState<ProblemMainCategory>('all');
  const [subCategory, setSubCategory] = useState<ProblemSubCategory>('all');

  const subCategoryItems = PROBLEM_SUB_CATEGORY_TABS[mainCategory] ?? [];

  const filteredProblemSets = useMemo(() => {
    return filterProblemSets({
      problemSets: mockProblemSets,
      mainCategory,
      subCategory,
      keyword,
      sort,
    });
  }, [keyword, mainCategory, sort, subCategory]);

  const handleMainCategoryChange = (value: ProblemMainCategory) => {
    setMainCategory(value);
    setSubCategory('all');
  };

  return (
    <main className="bg-bg-white min-h-full">
      <section className="mx-auto w-[1038px] py-[40px]">
        <div className="flex flex-col gap-[14px]">
          <ListFilterBar
            sortOptions={PROBLEM_SORT_OPTIONS}
            selectedSort={sort}
            searchValue={keyword}
            searchPlaceholder="검색"
            searchHistories={PROBLEM_SEARCH_HISTORIES}
            onSortChange={setSort}
            onSearchChange={setKeyword}
            onSearchSubmit={(value) => {
              setKeyword(value);
            }}
            onSearchClear={() => {
              setKeyword('');
            }}
            onSearchHistorySelect={(value) => {
              setKeyword(value);
            }}
          />

          <CategoryTabs
            size="sm"
            items={PROBLEM_MAIN_CATEGORY_TABS}
            activeValue={mainCategory}
            onChange={handleMainCategoryChange}
          />

          {subCategoryItems.length > 0 && (
            <ProblemSubCategoryTabs
              items={subCategoryItems}
              activeValue={subCategory}
              onChange={setSubCategory}
            />
          )}
        </div>

        <div className="mt-[32px]">
          <ProblemCardGrid problemSets={filteredProblemSets} />
        </div>
      </section>
    </main>
  );
}
