import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';

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

  return (
    <div className="flex w-[457px] items-center justify-center rounded-[25px] bg-white px-14 py-10">
      <div className="w-full">
        <div className="pb-10">
          <Image src="/brands/cheese-logo.svg" alt="CHEESE" width={125} height={34} priority />
        </div>
        {children}
      </div>
    </div>
  );
}
