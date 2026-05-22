import Link from 'next/link';

import type { ProblemQuestion } from '../types/problemSolving';

type ProblemSideTocProps = {
  problemSetId: string;
  questions: ProblemQuestion[];
  isOpen: boolean;
  onClose: () => void;
};

export default function ProblemSideToc({
  problemSetId,
  questions,
  isOpen,
  onClose,
}: ProblemSideTocProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <aside className="bg-bg-white fixed top-[80px] right-0 z-50 flex h-[calc(100dvh-80px)] w-[360px] flex-col px-[32px] py-[32px] shadow-[-8px_0_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between border-b border-gray-300 pb-[22px]">
        <h2 className="text-[20px] font-bold">목차</h2>
        <button type="button" className="text-[28px] text-gray-500" onClick={onClose}>
          »
        </button>
      </div>

      <div className="mt-[24px] flex flex-col gap-[24px]">
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
    </aside>
  );
}
