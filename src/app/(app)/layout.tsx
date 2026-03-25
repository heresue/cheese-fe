import AppSidebar from '@/components/layout/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--color-bg)]">
      <AppSidebar />
      <main className="min-w-0 flex-1 overflow-hidden bg-[var(--color-bg-surface)]">
        {children}
      </main>
    </div>
  );
}
