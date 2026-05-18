import Link from 'next/link';

import type { ProblemSet, ProblemThumbnailType } from '../types/problem';

type ProblemCardProps = {
  problemSet: ProblemSet;
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

const thumbnailClassNameMap: Record<ProblemThumbnailType, string> = {
  css: 'bg-[linear-gradient(135deg,#13A8E8_0%,#0668B7_100%)]',
  html: 'bg-[linear-gradient(135deg,#FF9B3D_0%,#E9581A_100%)]',
  js: 'bg-[#FFE058]',
};

function ProblemThumbnail({ type }: { type: ProblemThumbnailType }) {
  if (type === 'js') {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center',
          thumbnailClassNameMap[type],
        )}
      >
        <span className="font-sans text-[44px] leading-none font-bold tracking-[-0.02em] text-black">
          JS
        </span>
      </div>
    );
  }

  const label = type === 'css' ? 'CSS' : 'HTML';
  const number = type === 'css' ? '3' : '5';

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden',
        thumbnailClassNameMap[type],
      )}
    >
      <span className="absolute top-[16px] left-[20px] font-sans text-[24px] leading-none font-bold text-white">
        {label}
      </span>
      <span className="font-sans text-[92px] leading-none font-black text-white/90">{number}</span>
    </div>
  );
}

export default function ProblemCard({ problemSet }: ProblemCardProps) {
  const progressPercent =
    problemSet.totalCount === 0 ? 0 : (problemSet.solvedCount / problemSet.totalCount) * 100;

  return (
    <Link
      href={`/problem/${problemSet.id}`}
      className="bg-bg-white block h-[250px] w-[226px] overflow-hidden rounded-[8px] border border-gray-300 transition-shadow hover:shadow-[0_4px_16px_rgb(var(--color-gray-500-rgb)/0.25)]"
    >
      <div className="relative h-[140px] w-full overflow-hidden">
        <ProblemThumbnail type={problemSet.thumbnailType} />

        <span className="bg-bg-white absolute top-[14px] left-[14px] flex h-[26px] min-w-[40px] items-center justify-center rounded-full px-[10px] font-sans text-[12px] leading-none font-bold text-gray-900">
          {problemSet.badge}
        </span>
      </div>

      <div className="px-[18px] pt-[14px]">
        <h3 className="text-text truncate font-sans text-[15px] leading-[22px] font-semibold tracking-[-0.02em]">
          {problemSet.title}
        </h3>

        <p className="text-text-muted mt-[6px] font-sans text-[12px] leading-[18px] font-medium tracking-[-0.02em]">
          {problemSet.lastProgressDate} 진행
        </p>

        <div className="mt-[14px]">
          <div className="h-[4px] w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-secondary-600 h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-[5px] flex justify-end font-sans text-[12px] leading-[18px] font-medium tracking-[-0.02em] text-gray-600">
            {problemSet.solvedCount}/{problemSet.totalCount}
          </div>
        </div>
      </div>
    </Link>
  );
}
