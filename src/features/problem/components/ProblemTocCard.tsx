import Link from 'next/link';

import type { ProblemQuestion } from '../types/problemSolving';

type ProblemTocCardProps = {
  problemSetId: string;
  questions: ProblemQuestion[];
};

export default function ProblemTocCard({ problemSetId, questions }: ProblemTocCardProps) {
  return (
    <section className="bg-bg-white mt-[32px] h-[720px] w-[1060px] rounded-[15px] px-[40px] py-[40px]">
      <h2 className="text-[24px] leading-[30px] font-bold">목차</h2>

      <div className="mt-[28px] border-t border-gray-300 pt-[24px]">
        <div className="flex flex-col gap-[24px]">
          {questions.map((question) => (
            <div key={question.id} className="flex h-[44px] items-center">
              <p className="shrink-0 text-[18px] leading-[24px] font-semibold">
                {String(question.no).padStart(2, '0')}. {question.title}
              </p>

              <div className="mx-[22px] h-px flex-1 border-t border-dotted border-gray-500" />

              <Link
                href={`/problem/${problemSetId}/questions/${question.id}`}
                className="bg-secondary-600 flex h-[44px] w-[96px] shrink-0 items-center justify-center rounded-[8px] text-[15px] font-medium text-white"
              >
                문제 선택
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
