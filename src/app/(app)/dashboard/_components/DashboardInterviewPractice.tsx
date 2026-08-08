'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import ProblemCard from '@/app/(app)/problem/_components/ProblemCard';
import { mockProblemSets } from '@/app/(app)/problem/_data/mockProblemSets';
import {
  getInProgressProblemSets,
  getProblemCarouselMaxStartIndex,
  PROBLEM_CARD_SCROLL_STEP,
} from '@/app/(app)/problem/_utils/getInProgressProblemSets';
import { ProblemSolvingIcon } from '@/assets/icons/sidebar';

import DashboardCarouselNavButton from './DashboardCarouselNavButton';
import DashboardSectionHeader from './DashboardSectionHeader';

export default function DashboardInterviewPractice() {
  const [startIndex, setStartIndex] = useState(0);

  const practiceSets = useMemo(() => getInProgressProblemSets(mockProblemSets), []);

  const maxStartIndex = getProblemCarouselMaxStartIndex(practiceSets.length);
  const visibleStartIndex = Math.min(startIndex, maxStartIndex);

  const canGoPrev = visibleStartIndex > 0;
  const canGoNext = visibleStartIndex < maxStartIndex;

  const handlePrev = () => {
    setStartIndex(Math.max(0, visibleStartIndex - 1));
  };

  const handleNext = () => {
    setStartIndex(Math.min(maxStartIndex, visibleStartIndex + 1));
  };

  return (
    <section className="mb-10">
      <DashboardSectionHeader icon={<ProblemSolvingIcon />} title="문제풀이" />

      {practiceSets.length > 0 ? (
        <div className="group relative w-full overflow-visible">
          <div className="w-full overflow-hidden">
            <div
              className="flex w-max gap-4 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${visibleStartIndex * PROBLEM_CARD_SCROLL_STEP}px)`,
              }}
            >
              {practiceSets.map((problemSet) => (
                <div key={problemSet.id} className="w-[231px] shrink-0">
                  <ProblemCard problemSet={problemSet} />
                </div>
              ))}
            </div>
          </div>

          {canGoPrev ? (
            <DashboardCarouselNavButton
              label="이전 문제풀이 보기"
              direction="left"
              onClick={handlePrev}
            />
          ) : null}

          {canGoNext ? (
            <DashboardCarouselNavButton
              label="다음 문제풀이 보기"
              direction="right"
              onClick={handleNext}
            />
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-[188px] flex-col items-center justify-center rounded-[10px] border border-gray-200 bg-white p-8 text-center">
          <p className="text-dashboard-gray text-[14px] leading-[22px] font-medium">
            진행 중인 문제풀이가 없습니다.
          </p>

          <Link
            href="/problem"
            className="text-dashboard-navy mt-3 text-[14px] leading-[22px] font-medium hover:underline"
          >
            문제풀이 시작하기
          </Link>
        </div>
      )}
    </section>
  );
}
