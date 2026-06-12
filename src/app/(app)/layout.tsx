import type { ReactNode } from 'react';

import AppSidebar from '@/components/layout/sidebar/AppSidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <AppSidebar />
      <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
