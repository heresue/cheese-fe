import Link from 'next/link';

import type { ProblemQuestion } from '../types/problemSolving';

type ProblemSideTocNavigation = {
  previousHref?: string;
  nextHref?: string;
  exitHref: string;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

type ProblemSideTocProps = {
  problemSetId: string;
  questions: ProblemQuestion[];
  isOpen: boolean;
  onClose: () => void;
  navigation?: ProblemSideTocNavigation;
};

type SideNavigationButtonProps = {
  href?: string;
  disabled?: boolean;
  children: string;
  direction: 'previous' | 'next';
};

function SideNavigationButton({
  href,
  disabled = false,
  children,
  direction,
}: SideNavigationButtonProps) {
  const content = (
    <>
      {direction === 'previous' && (
        <span aria-hidden="true" className="text-[20px] leading-none">
          ‹
        </span>
      )}

      <span>{children}</span>

      {direction === 'next' && (
        <span aria-hidden="true" className="text-[20px] leading-none">
          ›
        </span>
      )}
    </>
  );

  const className =
    'flex h-[44px] items-center justify-center gap-[4px] rounded-[8px] border border-secondary-600 bg-bg-white text-[14px] font-medium text-gray-700 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500';

  if (disabled || !href) {
    return (
      <button type="button" disabled className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export default function ProblemSideToc({
  problemSetId,
  questions,
  isOpen,
  onClose,
  navigation,
}: ProblemSideTocProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <aside className="bg-bg-white fixed top-[80px] right-0 z-50 flex h-[calc(100dvh-80px)] w-[360px] flex-col px-[32px] py-[32px] shadow-[-8px_0_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between border-b border-gray-300 pb-[22px]">
        <h2 className="text-[20px] font-bold">목차</h2>

        <button
          type="button"
          aria-label="목차 닫기"
          className="text-[28px] leading-none text-gray-500"
          onClick={onClose}
        >
          »
        </button>
      </div>

      <div className="mt-[24px] flex-1 overflow-y-auto pr-[4px]">
        <div className="flex flex-col gap-[24px]">
          {questions.map((question) => (
            <div key={question.id} className="flex items-center justify-between gap-[12px]">
              <p className="truncate text-[15px] font-medium">
                {String(question.no).padStart(2, '0')}. {question.title}
              </p>

              <Link
                href={`/problem/${problemSetId}/questions/${question.id}`}
                className="bg-secondary-600 flex h-[38px] w-[72px] shrink-0 items-center justify-center rounded-[8px] text-[13px] font-medium text-white"
              >
                문제 선택
              </Link>
            </div>
          ))}
        </div>
      </div>

      {navigation && (
        <div className="mt-[24px] shrink-0 border-t border-gray-300 pt-[16px]">
          <div className="grid grid-cols-2 gap-[10px]">
            <SideNavigationButton
              href={navigation.previousHref}
              disabled={navigation.previousDisabled}
              direction="previous"
            >
              이전문제
            </SideNavigationButton>

            <SideNavigationButton
              href={navigation.nextHref}
              disabled={navigation.nextDisabled}
              direction="next"
            >
              다음문제
            </SideNavigationButton>
          </div>

          <Link
            href={navigation.exitHref}
            className="bg-secondary-600 mt-[10px] flex h-[48px] w-full items-center justify-center rounded-[8px] text-[14px] font-medium text-white"
          >
            저장하고 종료하기
          </Link>
        </div>
      )}
    </aside>
  );
}
