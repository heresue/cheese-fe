export const mypageQueryKeys = {
  all: ['mypage'] as const,

  user: (userId: string | undefined) => [...mypageQueryKeys.all, userId] as const,
};
