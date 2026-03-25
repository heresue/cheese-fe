import type { ReactNode } from 'react';

import AppSidebar from '@/components/layout/AppSidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--color-bg)]">
      <AppSidebar />
      <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
