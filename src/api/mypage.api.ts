import { apiClient } from '@/api/client';

import type { PersonalProfile, Mypage, CompanyProfile, ProfileType } from '@/types/profile';

export async function getMypage(userId: string) {
  return apiClient<Mypage>('/backend-api/mypage', {
    method: 'GET',
    cache: 'no-store',
    query: { userId },
  });
}

export type UpdateActiveProfileTypeRequest = {
  userId: string;
  activeProfileType: ProfileType;
};

export async function updateActiveProfileType({
  userId,
  activeProfileType,
}: UpdateActiveProfileTypeRequest) {
  return apiClient<Mypage>('/backend-api/mypage/active-profile', {
    method: 'PATCH',
    body: JSON.stringify({ userId, activeProfileType }),
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

export type UpdateCompanyProfileRequest = {
  userId: string;
  data: Omit<CompanyProfile, 'id'>;
};

export async function updateCompanyProfile({ userId, data }: UpdateCompanyProfileRequest) {
  return apiClient<Mypage>('/backend-api/mypage/profile/company', {
    method: 'PATCH',
    body: JSON.stringify({ userId, ...data }),
  });
}
