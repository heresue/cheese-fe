'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import ProblemCard from '@/app/(app)/problem/_components/ProblemCard';
import { mockProblemSets } from '@/app/(app)/problem/_data/mockProblemSets';
import {
  getInProgressProblemSets,
  getProblemCarouselMaxStartIndex,
  PROBLEM_CARD_SCROLL_STEP,
} from '@/app/(app)/problem/_utils/getInProgressProblemSets';
import { ProblemSolvingIcon } from '@/assets/icons/sidebar';
import { cn } from '@/lib/cn';

import DashboardSectionHeader from './DashboardSectionHeader';

function CarouselNavButton({
  label,
  direction,
  onClick,
  className,
}: {
  label: string;
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'border-border text-dashboard-gray hover:border-secondary-600 hover:text-dashboard-black absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white opacity-0 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
        className,
      )}
    >
      <span aria-hidden="true" className="text-[18px] leading-none">
        {direction === 'left' ? '‹' : '›'}
      </span>
    </button>
  );
}

export default function DashboardInterviewPractice() {
  const [startIndex, setStartIndex] = useState(0);

  const practiceSets = useMemo(() => getInProgressProblemSets(mockProblemSets), []);
  const maxStartIndex = getProblemCarouselMaxStartIndex(practiceSets.length);

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;

  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxStartIndex));
  }, [maxStartIndex]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  };

  return (
    <section className="mb-10">
      <DashboardSectionHeader icon={<ProblemSolvingIcon />} title="면접 연습" />

      {practiceSets.length > 0 ? (
        <div className="group relative w-full">
          <div className="w-full overflow-hidden">
            <div
              className="flex w-max gap-4 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${startIndex * PROBLEM_CARD_SCROLL_STEP}px)`,
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
            <CarouselNavButton
              label="이전 면접 연습 보기"
              direction="left"
              onClick={handlePrev}
              className="left-0"
            />
          ) : null}

          {canGoNext ? (
            <CarouselNavButton
              label="다음 면접 연습 보기"
              direction="right"
              onClick={handleNext}
              className="right-0"
            />
          ) : null}
        </div>
      ) : (
        <div className="border-border flex min-h-[188px] flex-col items-center justify-center rounded-[10px] border bg-white p-8 text-center">
          <p className="text-dashboard-gray text-[14px] leading-[22px] font-medium">
            진행 중인 면접 연습이 없습니다.
          </p>

          <Link
            href="/problem"
            className="text-dashboard-navy mt-3 text-[14px] leading-[22px] font-medium hover:underline"
          >
            면접 연습 시작하기
          </Link>
        </div>
      )}
    </section>
  );
}
