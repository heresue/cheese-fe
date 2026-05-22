'use client';

import { useState } from 'react';

import type { ProblemQuestion } from '../types/problemSolving';

type ProblemQuestionCardProps = {
  question: ProblemQuestion;
  isLastQuestion: boolean;
  onNext: () => void;
  onRetry: () => void;
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function normalizeAnswer(value: string) {
  return value.replace(/\s+/g, '').toLowerCase();
}

export default function ProblemQuestionCard({
  question,
  isLastQuestion,
  onNext,
  onRetry,
}: ProblemQuestionCardProps) {
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedChoiceId, setSelectedChoiceId] = useState('');
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selfCheck, setSelfCheck] = useState<'correct' | 'incorrect' | ''>('');

  const selectedChoice = question.choices?.find((choice) => choice.id === selectedChoiceId);

  const answerValue = question.type === 'shortAnswer' ? textAnswer : (selectedChoice?.label ?? '');

  const isCorrect = normalizeAnswer(answerValue) === normalizeAnswer(question.correctAnswer);

  const canSubmit =
    question.type === 'shortAnswer' ? textAnswer.trim().length > 0 : selectedChoiceId.length > 0;

  const canMoveNext = question.gradingMode === 'self' ? selfCheck.length > 0 : isSubmitted;

  const resetQuestionState = () => {
    setTextAnswer('');
    setSelectedChoiceId('');
    setIsHintVisible(false);
    setIsSubmitted(false);
    setSelfCheck('');
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitted(true);
  };

  const handleRetry = () => {
    resetQuestionState();
    onRetry();
  };

  return (
    <section className="bg-bg-white w-[960px] rounded-[10px] px-[40px] py-[42px]">
      <div className="flex items-center gap-[12px] text-[14px]">
        <span className="text-secondary-600 font-medium">문제 {question.no}.</span>
        <span className="text-gray-700">{question.title}</span>
      </div>

      <h1 className="mt-[34px] text-[20px] leading-[30px] font-bold">{question.question}</h1>

      {question.type === 'shortAnswer' && (
        <div className="mt-[64px] border-b border-gray-400">
          <input
            value={textAnswer}
            disabled={isSubmitted}
            placeholder="내가 원래 썼던 답"
            className="h-[38px] w-full bg-transparent px-[12px] text-[16px] outline-none placeholder:text-gray-700 disabled:text-gray-900"
            onChange={(event) => {
              setTextAnswer(event.target.value);
            }}
          />
        </div>
      )}

      {question.type === 'multipleChoice' && (
        <ol className="mt-[36px] flex flex-col gap-[12px]">
          {question.choices?.map((choice) => {
            const isSelected = choice.id === selectedChoiceId;

            return (
              <li key={choice.id}>
                <button
                  type="button"
                  disabled={isSubmitted}
                  className={cn(
                    'flex items-center gap-[12px] text-[18px] font-medium',
                    isSelected ? 'text-success' : 'text-gray-900',
                  )}
                  onClick={() => {
                    setSelectedChoiceId(choice.id);
                  }}
                >
                  <span
                    className={cn(
                      'flex h-[24px] w-[24px] items-center justify-center rounded-full border text-[14px]',
                      isSelected ? 'border-success text-success' : 'border-gray-500 text-gray-500',
                    )}
                  >
                    {choice.id}
                  </span>
                  {choice.label}
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {isSubmitted && question.gradingMode === 'auto' && (
        <div className="mt-[28px]">
          <p className={cn('text-[18px] font-bold', isCorrect ? 'text-success' : 'text-error')}>
            {isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다.'}
          </p>

          <p className="mt-[18px] text-[16px] font-medium">정답 : {question.correctAnswer}</p>
        </div>
      )}

      {isSubmitted && question.gradingMode === 'self' && (
        <div className="mt-[28px]">
          <p className="text-[18px] font-bold text-gray-600">정답을 맞추셨나요?</p>

          <div className="mt-[14px] w-[330px] overflow-hidden rounded-[8px] border border-gray-300">
            <button
              type="button"
              className={cn(
                'flex h-[64px] w-full items-center gap-[18px] px-[20px] text-[16px]',
                selfCheck === 'correct'
                  ? 'bg-tag-green-500 text-white'
                  : 'bg-bg-white text-gray-700',
              )}
              onClick={() => {
                setSelfCheck('correct');
              }}
            >
              <span className="text-[28px] leading-none">✓</span>
              정답
            </button>

            <button
              type="button"
              className={cn(
                'flex h-[64px] w-full items-center gap-[18px] border-t border-gray-300 px-[20px] text-[16px]',
                selfCheck === 'incorrect' ? 'bg-error text-white' : 'bg-bg-white text-gray-700',
              )}
              onClick={() => {
                setSelfCheck('incorrect');
              }}
            >
              <span className="text-[28px] leading-none">×</span>
              오답
            </button>
          </div>

          <p className="mt-[18px] text-[16px] font-medium">정답 : {question.correctAnswer}</p>
        </div>
      )}

      {isHintVisible && (
        <div className="border-primary-800 mt-[28px] rounded-[8px] border px-[18px] py-[16px]">
          <p className="text-[14px] font-semibold">Hint 1.</p>
          <p className="mt-[10px] text-[16px] text-gray-700">{question.hint}</p>
        </div>
      )}

      <div className="mt-[34px] flex justify-end gap-[10px]">
        {isSubmitted ? (
          <>
            <button
              type="button"
              className="border-secondary-600 flex h-[54px] w-[110px] items-center justify-center rounded-[8px] border text-[16px] font-medium text-gray-700"
              onClick={handleRetry}
            >
              다시풀기
            </button>

            <button
              type="button"
              className="bg-secondary-600 flex h-[54px] w-[110px] items-center justify-center rounded-[8px] text-[16px] font-medium text-white disabled:bg-gray-400"
              disabled={!canMoveNext}
              onClick={onNext}
            >
              {isLastQuestion ? '결과보기' : '다음문제'}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="border-secondary-600 flex h-[44px] w-[100px] items-center justify-center rounded-[8px] border text-[15px] font-medium text-gray-700"
              onClick={() => {
                setIsHintVisible(true);
              }}
            >
              힌트보기
            </button>

            <button
              type="button"
              disabled={!canSubmit}
              className="bg-secondary-600 flex h-[44px] w-[100px] items-center justify-center rounded-[8px] text-[15px] font-medium text-white disabled:bg-gray-400"
              onClick={handleSubmit}
            >
              정답제출
            </button>
          </>
        )}
      </div>
    </section>
  );
}
