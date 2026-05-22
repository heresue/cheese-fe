import Link from 'next/link';

import type { ProblemResultRow } from '../types/problemSolving';

type ProblemResultTableProps = {
  problemSetId: string;
  rows: ProblemResultRow[];
};

function StatusIcon({ status }: { status: ProblemResultRow['status'] }) {
  if (status === 'correct') {
    return (
      <span className="bg-tag-green-500 flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[16px] leading-none font-bold text-white">
        ✓
      </span>
    );
  }

  if (status === 'incorrect') {
    return (
      <span className="bg-error flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[16px] leading-none font-bold text-white">
        ×
      </span>
    );
  }

  return (
    <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] bg-gray-500 text-[16px] leading-none font-bold text-white">
      »
    </span>
  );
}

export default function ProblemResultTable({ problemSetId, rows }: ProblemResultTableProps) {
  return (
    <section className="bg-bg-white mt-[32px] h-[640px] w-[1060px] rounded-[15px] px-[40px] py-[40px]">
      <div className="grid h-[44px] grid-cols-[1fr_160px_160px_160px] items-center border-b border-gray-300 text-center text-[24px] leading-[30px] font-bold">
        <div>문제명</div>
        <div>정답 결과</div>
        <div>소요시간</div>
        <div>복습</div>
      </div>

      <div className="mt-[24px] flex flex-col gap-[20px]">
        {rows.map((row) => (
          <div
            key={row.questionId}
            className="grid h-[44px] grid-cols-[1fr_160px_160px_160px] items-center text-[18px] leading-[24px]"
          >
            <div className="font-semibold">
              {String(row.no).padStart(2, '0')}. {row.title}
            </div>

            <div className="flex justify-center">
              <StatusIcon status={row.status} />
            </div>

            <div className="text-center font-medium">{row.elapsedTime || '-'}</div>

            <div className="flex justify-center">
              <Link
                href={`/problem/${problemSetId}/questions/${row.questionId}`}
                className="bg-secondary-600 flex h-[44px] w-[110px] items-center justify-center rounded-[8px] text-[15px] font-medium text-white"
              >
                다시 풀기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
