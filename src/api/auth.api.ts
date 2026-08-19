import { apiClient } from './client';

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
