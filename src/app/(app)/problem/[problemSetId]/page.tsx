import ProblemSetIntroView from '@/features/problem/views/ProblemSetIntroView';

type ProblemSetPageProps = {
  params: Promise<{
    problemSetId: string;
  }>;
};

export default async function ProblemSetPage({ params }: ProblemSetPageProps) {
  const { problemSetId } = await params;

  return <ProblemSetIntroView problemSetId={problemSetId} />;
}
