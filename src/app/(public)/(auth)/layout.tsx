import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import AuthCard from '../_components/AuthCard';

import { ApiError } from '@/api/client';
import { getMeFromServer } from '@/api/auth.api';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  let isAuthenticated = false;

  try {
    await getMeFromServer(cookie);
    isAuthenticated = true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      isAuthenticated = false;
    } else {
      throw error;
    }
  }

  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return <AuthCard>{children}</AuthCard>;
}
