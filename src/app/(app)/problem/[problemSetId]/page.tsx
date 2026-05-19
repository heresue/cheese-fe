import { notFound } from 'next/navigation';

import { mockProblemSets } from '@/features/problem/data/mockProblemSets';

type ProblemSetPageProps = {
  params: Promise<{
    problemSetId: string;
  }>;
};

export default async function ProblemSetPage({ params }: ProblemSetPageProps) {
  const { problemSetId } = await params;

  const problemSet = mockProblemSets.find((item) => item.id === problemSetId);

  if (!problemSet) {
    notFound();
  }

  return (
    <main className="bg-bg-white min-h-full px-10 py-10">
      <section className="bg-bg-white mx-auto w-[1038px] max-w-full rounded-[10px] border border-gray-300 p-8">
        <p className="text-text-muted font-sans text-[14px] font-medium">
          문제풀이 상세 페이지 준비 중
        </p>

        <h1 className="text-text mt-3 font-sans text-[24px] font-bold tracking-[-0.02em]">
          {problemSet.title}
        </h1>

        <p className="text-text-muted mt-2 font-sans text-[14px] font-medium">
          ID: {problemSet.id}
        </p>
      </section>
    </main>
  );
}
