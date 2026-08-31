import ProblemQuestionView from '@/app/(app)/problem/_views/ProblemQuestionView';

type ProblemQuestionPageProps = {
  params: Promise<{
    problemSetId: string;
    questionId: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
};

export default async function ProblemQuestionPage({
  params,
  searchParams,
}: ProblemQuestionPageProps) {
  const { problemSetId, questionId } = await params;
  const { from } = await searchParams;

  return (
    <ProblemQuestionView
      key={questionId}
      problemSetId={problemSetId}
      questionId={questionId}
      isReviewMode={from === 'result'}
    />
  );
}
