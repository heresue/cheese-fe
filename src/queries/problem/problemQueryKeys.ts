export const problemQueryKeys = {
  all: ['problem'] as const,

  byUser: (userId: string) => [...problemQueryKeys.all, 'user', userId] as const,
  sets: (userId: string) => [...problemQueryKeys.byUser(userId), 'sets'] as const,
  bySet: (userId: string, problemSetId: string) =>
    [...problemQueryKeys.byUser(userId), 'set', problemSetId] as const,
  detail: (userId: string, problemSetId: string) =>
    [...problemQueryKeys.bySet(userId, problemSetId), 'detail'] as const,
  questions: (userId: string, problemSetId: string) =>
    [...problemQueryKeys.bySet(userId, problemSetId), 'question'] as const,
  question: (userId: string, problemSetId: string, questionId: string) =>
    [...problemQueryKeys.questions(userId, problemSetId), questionId] as const,
  result: (userId: string, problemSetId: string) =>
    [...problemQueryKeys.bySet(userId, problemSetId), 'result'] as const,
};
