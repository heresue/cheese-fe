import Image from 'next/image';
import Link from 'next/link';

import type { ProblemSetSummary } from '../types/problemSolving';

type ProblemSetSummaryCardProps = {
  problemSetId: string;
  summary: ProblemSetSummary;
  actionLabel: string;
  actionHref: string;
};

export default function ProblemSetSummaryCard({
  problemSetId,
  summary,
  actionLabel,
  actionHref,
}: ProblemSetSummaryCardProps) {
  const progressPercent =
    summary.totalCount <= 0
      ? 0
      : Math.min(100, Math.max(0, (summary.solvedCount / summary.totalCount) * 100));

  return (
    <section className="bg-bg-white mx-auto flex h-[151.52px] w-[1060px] items-center rounded-[15px] px-[20px]">
      <div className="relative h-[120px] w-[250px] overflow-hidden rounded-[8px]">
        <Image
          src={summary.thumbnailSrc}
          alt={`${summary.title} 썸네일`}
          fill
          sizes="250px"
          className="object-cover"
        />

        <span className="bg-bg-white absolute top-[12px] left-[12px] flex h-[24px] w-[38px] items-center justify-center rounded-full text-[12px] leading-[24px] font-bold">
          FE
        </span>
      </div>

      <div className="ml-[32px] flex h-[120px] flex-1 flex-col justify-center">
        <h1 className="text-[20px] leading-[30px] font-bold">{summary.title}</h1>

        <p className="mt-[14px] text-[14px] leading-[20px] font-medium text-gray-600">
          마지막 진행일 : {summary.lastProgressDate}
        </p>

        <div className="mt-[14px] flex w-[500px] flex-col items-end">
          <div className="h-[8px] w-full overflow-hidden rounded-full bg-gray-300">
            <div
              className="bg-secondary-600 h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="mt-[4px] text-[13px] leading-[18px] font-medium text-gray-700">
            {summary.solvedCount}/{summary.totalCount} 완료
          </span>
        </div>
      </div>

      <Link
        href={actionHref}
        className="bg-secondary-600 flex h-[54px] min-w-[128px] items-center justify-center rounded-[10px] px-[20px] text-[16px] font-bold text-white"
      >
        {actionLabel}
      </Link>

      <span className="sr-only">문제 세트 ID: {problemSetId}</span>
    </section>
  );
}
