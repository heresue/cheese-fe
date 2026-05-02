import MypageHeaderTitle from './_components/MypageHeaderTitle';
import MyPageSidebar from './_components/MypageSidebar';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-2 flex min-h-dvh items-center justify-center px-8 py-6">
      <div className="w-full max-w-[1200px]">
        <div className="flex h-[70vh] max-h-[780px] min-h-[560px] w-full overflow-hidden rounded-[10px] border border-gray-300 bg-white">
          <aside className="w-[200px] shrink-0 border-r border-gray-300">
            <MyPageSidebar />
          </aside>
          <div className="flex min-w-0 flex-1 flex-col gap-8 overflow-y-auto p-10">
            <div>
              <MypageHeaderTitle />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
