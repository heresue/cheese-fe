import type { ProblemSet } from '../types/problem';
import ProblemCard from './ProblemCard';

type ProblemCardGridProps = {
  problemSets: ProblemSet[];
};

export default function ProblemCardGrid({ problemSets }: ProblemCardGridProps) {
  if (problemSets.length === 0) {
    return (
      <div className="bg-bg-white flex h-[240px] items-center justify-center rounded-[10px] border border-gray-300">
        <p className="text-text-muted font-sans text-[15px] font-medium">
          조건에 맞는 문제풀이가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(4,226px)] gap-x-[34px] gap-y-[42px]">
      {problemSets.map((problemSet) => (
        <ProblemCard key={problemSet.id} problemSet={problemSet} />
      ))}
    </div>
  );
}
