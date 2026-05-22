import { notFound } from 'next/navigation';

import {
  getProblemQuestion,
  getProblemQuestionIndex,
} from '@/features/problem/data/mockProblemSolving';
import ProblemQuestionView from '@/features/problem/views/ProblemQuestionView';

type ProblemQuestionPageProps = {
  params: Promise<{
    problemSetId: string;
    questionId: string;
  }>;
};

export default async function ProblemQuestionPage({ params }: ProblemQuestionPageProps) {
  const { problemSetId, questionId } = await params;

  const question = getProblemQuestion(questionId);
  const questionIndex = getProblemQuestionIndex(questionId);

  if (!question || questionIndex < 0) {
    notFound();
  }

  return (
    <ProblemQuestionView
      key={question.id}
      problemSetId={problemSetId}
      question={question}
      questionIndex={questionIndex}
    />
  );
}
