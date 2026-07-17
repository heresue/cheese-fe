import type { StaticImageData } from 'next/image';

export type ProblemQuestionType = 'shortAnswer' | 'multipleChoice';

export type ProblemGradingMode = 'auto' | 'self';

export type ProblemSolveStatus = 'correct' | 'incorrect' | 'pending';

export type ProblemChoice = {
  id: string;
  label: string;
};

export type ProblemQuestion = {
  id: string;
  no: number;
  title: string;
  question: string;
  type: ProblemQuestionType;
  gradingMode: ProblemGradingMode;
  correctAnswer: string;
  explanation?: string;
  hint: string;
  choices?: ProblemChoice[];
  savedAnswer?: string;
  savedChoiceId?: string;
};

export type ProblemSetSummary = {
  id: string;
  title: string;
  lastProgressDate: string;
  thumbnailSrc: string | StaticImageData;
  solvedCount: number;
  totalCount: number;
};

export type ProblemResultRow = {
  questionId: string;
  no: number;
  title: string;
  status: ProblemSolveStatus;
  elapsedTime: string;
};
