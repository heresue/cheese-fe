export const memoQueryKeys = {
  all: ['memo'] as const,

  byUser: (userId: string) => [...memoQueryKeys.all, 'user', userId] as const,
  data: (userId: string) => [...memoQueryKeys.byUser(userId), 'data'] as const,
};
