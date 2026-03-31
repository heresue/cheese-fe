export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* 임시 스타일 설정 */}
      <aside className="w-[240px] shrink-0">Sidebar</aside>
      <div className="min-h-dvh min-w-0 flex-1">{children}</div>
    </div>
  );
}
