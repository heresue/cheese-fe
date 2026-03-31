import MyPageSidebar from '@/app/(app)/(no-memo)/mypage/_components/Mypage-Sidebar';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-2 flex min-h-dvh items-center justify-center px-8 py-6">
      <div className="w-full max-w-[1200px]">
        <div className="flex h-[70vh] max-h-[780px] min-h-[560px] w-full overflow-hidden rounded-[10px] border border-gray-900 bg-white">
          <aside className="w-[240px] shrink-0 border-r border-gray-300">
            <MyPageSidebar />
          </aside>
          <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
