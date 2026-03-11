export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--color-bg)]">
      <aside className="w-[260px] shrink-0">Sidebar</aside>
      <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
