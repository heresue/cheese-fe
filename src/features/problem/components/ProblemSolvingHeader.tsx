import Link from 'next/link';

type ProblemSolvingHeaderProps = {
  title: string;
  backHref: string;
  elapsedTime: string;
  current: number;
  total: number;
  onMenuClick: () => void;
};

export default function ProblemSolvingHeader({
  title,
  backHref,
  elapsedTime,
  current,
  total,
  onMenuClick,
}: ProblemSolvingHeaderProps) {
  const progressPercent = total <= 0 ? 0 : Math.min(100, (current / total) * 100);

  return (
    <header className="bg-bg-1 flex h-[80px] items-center justify-between border-b border-gray-300 px-[32px]">
      <Link href={backHref} className="flex items-center gap-[18px] text-[20px] font-medium">
        <span aria-hidden="true" className="text-[32px] leading-none text-gray-700">
          ‹
        </span>
        <span>{title}</span>
      </Link>

      <div className="flex items-center gap-[28px]">
        <span className="text-[24px] leading-[30px] font-semibold">{elapsedTime}</span>

        <div className="h-[40px] w-px bg-gray-300" />

        <div className="flex items-center gap-[12px]">
          <div className="h-[6px] w-[300px] overflow-hidden rounded-full border border-gray-400 bg-gray-200">
            <div
              className="bg-secondary-600 h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[12px] font-medium text-gray-700">
            {current}/{total} 진행중
          </span>
        </div>

        <button
          type="button"
          aria-label="목차 열기"
          className="flex h-[44px] w-[44px] items-center justify-center text-gray-700"
          onClick={onMenuClick}
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block h-[3px] w-[28px] rounded-full bg-current" />
            <span className="block h-[3px] w-[28px] rounded-full bg-current" />
            <span className="block h-[3px] w-[28px] rounded-full bg-current" />
          </span>
        </button>
      </div>
    </header>
  );
}
