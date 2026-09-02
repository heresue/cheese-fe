import { apiClient } from '@/api/client';

import type { PersonalProfile, Mypage } from '@/types/profile';

export async function getMypage(userId: string) {
  return apiClient<Mypage>('/backend-api/mypage', {
    method: 'GET',
    cache: 'no-store',
    query: { userId },
  });
}

export type UpdatePersonalProfileRequest = {
  userId: string;
  data: Omit<PersonalProfile, 'id'>;
};

export async function updatePersonalProfile({ userId, data }: UpdatePersonalProfileRequest) {
  return apiClient<Mypage>('/backend-api/mypage/profile/personal', {
    method: 'PATCH',
    body: JSON.stringify({ userId, ...data }),
  });
}
