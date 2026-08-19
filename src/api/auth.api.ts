import { apiClient, ApiError } from './client';

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  nickname: string;
  email: string;
  activeProfileType: 'personal' | 'company';
};

export function login(data: LoginRequest) {
  return apiClient<AuthUser>('/backend-api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMe() {
  return apiClient<AuthUser>('/backend-api/auth/me', {
    method: 'GET',
    cache: 'no-store',
  });
}

export async function getMeFromServer(cookie: string) {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL이 설정되지 않았습니다.');
  }

  const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      Cookie: cookie,
    },
  });

  if (!response.ok) {
    throw new ApiError('사용자 인증에 실패했습니다.', response.status);
  }

  return (await response.json()) as AuthUser;
}

export type LogoutResponse = {
  success: boolean;
};

export function logout() {
  return apiClient<LogoutResponse>('/backend-api/auth/logout', {
    method: 'POST',
  });
}
