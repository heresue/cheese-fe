'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ProblemQuestionCard from '../components/ProblemQuestionCard';
import ProblemSideToc from '../components/ProblemSideToc';
import ProblemSolvingHeader from '../components/ProblemSolvingHeader';
import { mockProblemQuestions } from '../data/mockProblemSolving';
import type { ProblemQuestion } from '../types/problemSolving';
import { formatElapsedTime } from '../utils/formatElapsedTime';

type ProblemQuestionViewProps = {
  problemSetId: string;
  question: ProblemQuestion;
  questionIndex: number;
};

export default function ProblemQuestionView({
  problemSetId,
  question,
  questionIndex,
}: ProblemQuestionViewProps) {
  const router = useRouter();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const isLastQuestion = questionIndex === mockProblemQuestions.length - 1;
  const previousQuestion = mockProblemQuestions[questionIndex - 1];
  const nextQuestion = mockProblemQuestions[questionIndex + 1];

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setElapsedSeconds((prevElapsedSeconds) => prevElapsedSeconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const handleNext = () => {
    if (isLastQuestion) {
      router.push(`/problem/${problemSetId}/result`);
      return;
    }

    router.push(`/problem/${problemSetId}/questions/${nextQuestion.id}`);
  };

  const handleRetry = () => {
    setElapsedSeconds(0);
  };

  return (
    <main className="bg-bg-1 min-h-dvh">
      <ProblemSolvingHeader
        title={`${String(question.no).padStart(2, '0')}. ${question.title}`}
        backHref={`/problem/${problemSetId}`}
        elapsedTime={formatElapsedTime(elapsedSeconds)}
        current={question.no}
        total={mockProblemQuestions.length}
        onMenuClick={() => {
          setIsTocOpen(true);
        }}
      />

      <div className="flex min-h-[calc(100dvh-80px)] items-center justify-center py-[60px]">
        <ProblemQuestionCard
          question={question}
          isLastQuestion={isLastQuestion}
          onNext={handleNext}
          onRetry={handleRetry}
        />
      </div>

      <ProblemSideToc
        problemSetId={problemSetId}
        questions={mockProblemQuestions}
        isOpen={isTocOpen}
        onClose={() => {
          setIsTocOpen(false);
        }}
        navigation={{
          previousHref: previousQuestion
            ? `/problem/${problemSetId}/questions/${previousQuestion.id}`
            : undefined,
          nextHref: nextQuestion
            ? `/problem/${problemSetId}/questions/${nextQuestion.id}`
            : `/problem/${problemSetId}/result`,
          exitHref: `/problem/${problemSetId}`,
          previousDisabled: !previousQuestion,
          nextDisabled: false,
        }}
      />
    </main>
  );
}
