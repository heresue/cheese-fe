import { apiClient } from './client';

export type ApiProblemStatus = 'notStarted' | 'correct' | 'wrong' | 'skipped';

export type ApiProblemAnswer = {
  choiceId?: string;
  text?: string;
};

export type ApiProblemSetSummary = {
  id: string;
  title: string;
  description?: string;
  category: string;
  subCategory: string;
  thumbnailUrl?: string;
  totalQuestionCount: number;
  solvedQuestionCount: number;
  correctQuestionCount: number;
  lastSolvedAt?: string;
  createdAt: string;
};

export type ApiProblemQuestionSummary = {
  id: string;
  order: number;
  title: string;
  type: 'multipleChoice' | 'shortAnswer';
  status?: ApiProblemStatus;
};

export type ApiProblemSetDetail = ApiProblemSetSummary & {
  questions: ApiProblemQuestionSummary[];
};

export type ApiProblemChoice = {
  id: string;
  text: string;
};

export type ApiProblemQuestion = {
  id: string;
  problemSetId: string;
  order: number;
  title: string;
  type: 'multipleChoice' | 'shortAnswer';
  question: string;
  description?: string;
  hint?: string;
  choices?: ApiProblemChoice[];
  myAnswer?: ApiProblemAnswer;
  status?: ApiProblemStatus;
  elapsedSeconds?: number;
};

export type ApiProblemResultQuestion = {
  questionId: string;
  order: number;
  title: string;
  type: 'multipleChoice' | 'shortAnswer';
  status: Exclude<ApiProblemStatus, 'notStarted'>;
  elapsedSeconds: number;
  myAnswer?: ApiProblemAnswer;
  correctAnswer?: ApiProblemAnswer;
};

export type ApiProblemSetResult = {
  problemSetId: string;
  title: string;
  totalQuestionCount: number;
  solvedQuestionCount: number;
  correctQuestionCount: number;
  wrongQuestionCount: number;
  skippedQuestionCount: number;
  accuracy: number;
  totalElapsedSeconds: number;
  completedAt?: string;
  questions: ApiProblemResultQuestion[];
};

export type SaveProblemAnswer = {
  selectedChoiceId?: string;
  answer?: string;
  elapsedSeconds: number;
};

type UserRequest = {
  userId: string;
  signal?: AbortSignal;
};

type ProblemSetRequest = UserRequest & {
  problemSetId: string;
};

type ProblemQuestionRequest = ProblemSetRequest & {
  questionId: string;
};

type ProblemAnswerRequest = ProblemQuestionRequest & {
  answer: SaveProblemAnswer;
};

function toSaveAnswerBody(answer: SaveProblemAnswer) {
  return {
    choiceId: answer.selectedChoiceId,
    text: answer.answer,
    elapsedSeconds: answer.elapsedSeconds,
  };
}

export function getProblemSets({ userId, signal }: UserRequest) {
  return apiClient<ApiProblemSetSummary[]>('/backend-api/problem-sets', {
    method: 'GET',
    query: { userId },
    signal,
    cache: 'no-store',
  });
}

export function getProblemSetDetail({ userId, problemSetId, signal }: ProblemSetRequest) {
  return apiClient<ApiProblemSetDetail>(`/backend-api/problem-sets/${problemSetId}`, {
    method: 'GET',
    query: { userId },
    signal,
    cache: 'no-store',
  });
}

export function getProblemQuestion({
  userId,
  problemSetId,
  questionId,
  signal,
}: ProblemQuestionRequest) {
  return apiClient<ApiProblemQuestion>(
    `/backend-api/problem-sets/${problemSetId}/questions/${questionId}`,
    {
      method: 'GET',
      query: { userId },
      signal,
      cache: 'no-store',
    },
  );
}

export function saveProblemAnswer({
  userId,
  problemSetId,
  questionId,
  answer,
}: ProblemAnswerRequest) {
  return apiClient<ApiProblemQuestion>(
    `/backend-api/problem-sets/${problemSetId}/questions/${questionId}/answer`,
    {
      method: 'PUT',
      query: { userId },
      body: JSON.stringify(toSaveAnswerBody(answer)),
    },
  );
}

export function submitProblemAnswer({
  userId,
  problemSetId,
  questionId,
  answer,
}: ProblemAnswerRequest) {
  return apiClient<ApiProblemQuestion>(
    `/backend-api/problem-sets/${problemSetId}/questions/${questionId}/submit`,
    {
      method: 'POST',
      query: { userId },
      body: JSON.stringify(toSaveAnswerBody(answer)),
    },
  );
}

export function skipProblemQuestion({
  userId,
  problemSetId,
  questionId,
  answer,
}: ProblemAnswerRequest) {
  return apiClient<ApiProblemQuestion>(
    `/backend-api/problem-sets/${problemSetId}/questions/${questionId}/skip`,
    {
      method: 'POST',
      query: { userId },
      body: JSON.stringify(toSaveAnswerBody(answer)),
    },
  );
}

export function getProblemSetResult({ userId, problemSetId, signal }: ProblemSetRequest) {
  return apiClient<ApiProblemSetResult>(`/backend-api/problem-sets/${problemSetId}/result`, {
    method: 'GET',
    query: { userId },
    signal,
    cache: 'no-store',
  });
}

export function retryProblemSet({ userId, problemSetId }: ProblemSetRequest) {
  return apiClient<ApiProblemSetDetail>(`/backend-api/problem-sets/${problemSetId}/retry`, {
    method: 'POST',
    query: { userId },
  });
}
