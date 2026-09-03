import { useQuery } from '@tanstack/react-query';

import { getMypage } from '@/api/mypage.api';
import { mypageQueryKeys } from '@/queries/mypage/mypageQueryKeys';

export function useMypage(userId: string | undefined) {
  return useQuery({
    queryKey: mypageQueryKeys.user(userId),
    queryFn: ({ signal }) => {
      if (!userId) {
        throw new Error('userId가 필요합니다');
      }

      return getMypage(userId, signal);
    },
    enabled: !!userId,
  });
}
