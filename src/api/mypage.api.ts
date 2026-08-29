import { apiClient } from '@/api/client';

import type { Mypage } from '@/types/profile';

export async function getMypage(userId: string) {
  return apiClient<Mypage>('/backend-api/mypage', {
    method: 'GET',
    cache: 'no-store',
    query: { userId },
  });
}
