'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { ApiError } from '@/api/client';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isPending, error } = useCurrentUser();

  const isUnauthorized = error instanceof ApiError && error.status === 401;

  useEffect(() => {
    if (isUnauthorized) {
      router.replace('/login');
    }
  }, [isUnauthorized, router]);

  if (isPending || isUnauthorized) {
    return null;
  }

  if (error) {
    throw error;
  }

  return children;
}
