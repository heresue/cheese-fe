import ProblemResultView from '@/features/problem/views/ProblemResultView';

type ProblemResultPageProps = {
  params: Promise<{
    problemSetId: string;
  }>;
};

export default async function ProblemResultPage({ params }: ProblemResultPageProps) {
  const { problemSetId } = await params;

  return <ProblemResultView problemSetId={problemSetId} />;
}
