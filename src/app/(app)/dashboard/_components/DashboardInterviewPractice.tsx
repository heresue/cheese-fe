'use client';

import { useRef } from 'react';

import Link from 'next/link';

import ProblemCard from '@/app/(app)/problem/_components/ProblemCard';
import { mockProblemSets } from '@/app/(app)/problem/_data/mockProblemSets';
import { ProblemSolvingIcon } from '@/assets/icons/sidebar';

import DashboardSectionHeader from './DashboardSectionHeader';

export default function DashboardInterviewPractice() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const practiceSets = mockProblemSets.slice(0, 4);

  const handleScrollNext = () => {
    scrollRef.current?.scrollBy({ left: 247, behavior: 'smooth' });
  };

  return (
    <section className="mb-10">
      <DashboardSectionHeader icon={<ProblemSolvingIcon />} title="면접 연습" />

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {practiceSets.map((problemSet) => (
            <ProblemCard key={problemSet.id} problemSet={problemSet} />
          ))}
        </div>

        {practiceSets.length > 0 ? (
          <button
            type="button"
            aria-label="다음 면접 연습 보기"
            onClick={handleScrollNext}
            className="border-border text-dashboard-gray hover:border-secondary-600 hover:text-dashboard-black absolute top-1/2 right-0 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          >
            <span aria-hidden="true" className="text-[18px] leading-none">
              ›
            </span>
          </button>
        ) : null}
      </div>

      {practiceSets.length === 0 ? (
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
      ) : null}
    </section>
  );
}
