'use client';

import ArrowIcon from '@/assets/icons/common/arrow.svg';
import ViewIcon from '@/assets/icons/common/view.svg';

type PostDetailHeaderProps = {
  title: string;
  createdAt: string;
  viewCount: number;
};

export default function PostDetailHeader({ title, createdAt, viewCount }: PostDetailHeaderProps) {
  return (
    <header className="flex flex-col gap-2 border-b border-gray-300 pt-8 pb-5">
      {/* TODO: BackButton 컴포넌트로 분리 후 뒤로가기 동작 연결 */}
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="뒤로가기"
          className="flex h-[30px] w-[30px] items-center justify-center"
        >
          <ArrowIcon className="h-4 text-gray-700" />
        </button>

        <h1 className="text-2xl leading-[30px] font-bold">{title}</h1>
      </div>

      <div className="flex items-center justify-end gap-5 text-gray-600">
        <span className="text-[14px] leading-6">{createdAt}</span>

        <div className="flex h-6 items-center gap-1">
          <ViewIcon className="w-4 text-gray-500" />
          <span className="text-[12px] leading-6 font-medium">{viewCount}</span>
        </div>
      </div>
    </header>
  );
}
