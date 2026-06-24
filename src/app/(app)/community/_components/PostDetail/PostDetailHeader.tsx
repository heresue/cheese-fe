'use client';

import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/common/BackButton';

import ViewIcon from '@/assets/icons/common/view.svg';

type PostDetailHeaderProps = {
  title: string;
  createdAt: string;
  viewCount: number;
};

export default function PostDetailHeader({ title, createdAt, viewCount }: PostDetailHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex flex-col gap-2 border-b border-gray-300 pt-8 pb-5">
      <div className="flex gap-2">
        <BackButton onClick={() => router.back()} />

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
